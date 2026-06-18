# AI Agent Task Orchestration: Assembly API (Node.js & Firebase Functions)

This document serves as an autonomous task system for AI development agents. The target project uses **Node.js** and **Firebase Functions (v2 HTTPS Triggers)**.

---

## 🛠️ Execution Graph & Parallelization Strategy

To optimize agent execution, follow this dependency roadmap:

```
[Phase 1: Setup (Sequential)]
         │
         ▼
[Phase 2: Independent Endpoints (PARALLEL Execution)]
 ├── Task 2.1: GET /api/assembly/attendees
 ├── Task 2.2: GET /api/assembly/coefficient
 ├── Task 2.3: GET /api/assembly/all
 └── Task 2.4: PUT /api/assembly/create
         │
         ▼
[Phase 3: Dependent Operations (SEQUENTIAL / Targeted Parallel)]
 ├── Task 3.1: GET /api/assembly/votes?id={id}
 ├── Task 3.2: POST /api/assembly/restart
 └── Task 3.3: POST /api/assembly/close

```

---

## 📦 PHASE 1: INITIALIZATION & SHARED CONTRACTS (SEQUENTIAL)

### TASK-1.1: Shared Types and Firebase SDK Setup

* **Execution Type:** SEQUENTIAL (Must be completed first).
* **Objective:** Establish the common TypeScript data contracts and verify Firebase Admin initialization to ensure type safety across all functions.
* **Context & Contextual Code:**
Create or update a shared types file (`types.ts` or similar directory structure in your Node.js project) with the following exact interfaces:
```typescript
export interface AssemblyStats {
  attendanceCount: number;
  totalUnits: number;
  coefficientPercentage: number;
  quorumPercentage: number;
  minRequiredPercentage: number;
}

export interface SurveyOption {
  text: string;
  votesCount: number;
  coefficientVotes: number;
}

export interface Survey {
  id: string;
  question: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  mostVotedOption?: string;
  mostVotedVotes?: number;
  mostVotedCoefficient?: number;
  options?: SurveyOption[];
}

export interface Answer {
  value: string;
  votes: number;
}

export interface SurveyLegacy {
  id?: string;
  question: string;
  options: Answer[];
  timeUsed: string;
  createDate: any; // Firebase Timestamp or Date
  status: 'OPEN' | 'CLOSED';
}

```


* **Instructions for the Agent:**
1. Locate the Firebase Functions source directory (typically `functions/src`).
2. Create a `models/interfaces.ts` file and paste the interfaces above.
3. Ensure `firebase-admin` is initialized properly in the root index file (`admin.initializeApp()`) to allow Firestore database connectivity across all subsequent tasks.



---

## ⚡ PHASE 2: INDEPENDENT ENDPOINTS (PARALLEL EXECUTION)

*The following tasks have no dependencies on each other and can be assigned to separate agents simultaneously.*

### TASK-2.1: Implement Endpoint `GET /api/assembly/attendees`

* **Execution Type:** PARALLEL
* **Objective:** Create an HTTP Firebase Function using Node.js to retrieve assembly attendance metrics.
* **Database Assumptions:** Firestore Collection `assemblies` or `attendees`.
* **Expected Output Structure:**
```json
{
  "attendanceCount": 45,
  "totalUnits": 100
}

```


* **Instructions for the Agent:**
1. Export a new v2 HTTPS function named `getAttendees` mapped to the relative routing paths if an Express app wrapper is used, or as a direct standalone HTTPS trigger pointing to `/api/assembly/attendees`.
2. Implement database logic: Query the current active assembly state to count the total registered/present units (`attendanceCount`) against the absolute total units of the property (`totalUnits`).
3. Enforce Auth Check: Verify that the request header contains valid authentication credentials (simulating `fetchAuth`). Return a `401 Unauthorized` status if missing.
4. Return a `200 OK` status with the JSON structure matching the fields above.



### TASK-2.2: Implement Endpoint `GET /api/assembly/coefficient`

* **Execution Type:** PARALLEL
* **Objective:** Create an HTTP Firebase Function using Node.js to retrieve real-time quorum and coefficient metrics.
* **Database Assumptions:** Aggregated data or real-time evaluation of present units inside Firestore.
* **Expected Output Structure:**
```json
{
  "coefficientPercentage": 62.45,
  "quorumPercentage": 62.45,
  "minRequiredPercentage": 50.0
}

```


* **Instructions for the Agent:**
1. Export an HTTPS function named `getCoefficient` handling the route `/api/assembly/coefficient`.
2. Implement business rules: Calculate the sum of property coefficients (`coefficientPercentage`) for all units currently marked as present. Map this value directly to `quorumPercentage`. Fetch the static minimum requirement for the assembly session (`minRequiredPercentage`).
3. Enforce Auth Check: Ensure the incoming request is authenticated.
4. Return a `200 OK` JSON response containing the metrics specified above.



### TASK-2.3: Implement Endpoint `GET /api/assembly/all`

* **Execution Type:** PARALLEL
* **Objective:** Create an HTTP Firebase Function using Node.js to list all current and past surveys.
* **Expected Output Structure:** An array conforming to the `Survey[]` interface:
```json
[
  {
    "id": "survey-uuid-123",
    "question": "Sample Question Text",
    "status": "OPEN",
    "createdAt": "2026-06-18T10:00:00Z",
    "options": [
      { "text": "Option 1", "votesCount": 0, "coefficientVotes": 0 }
    ]
  }
]

```


* **Instructions for the Agent:**
1. Export an HTTPS function named `getAllSurveys` handling requests at `/api/assembly/all`.
2. Implement database logic: Fetch all documents from the `surveys` collection in Firestore.
3. UI Compatibility Mapping: Ensure that the items fetched map fields appropriately to the frontend `Survey` interface definition (e.g., convert Firestore Timestamps to ISO strings for `createdAt`).
4. Return `200 OK` with the JSON array.



### TASK-2.4: Implement Endpoint `PUT /api/assembly/create`

* **Execution Type:** PARALLEL
* **Objective:** Create an HTTP Firebase Function using Node.js to initialize and persist a new survey question.
* **Expected Input Payload (JSON Body):**
```json
{
  "question": "Should we approve the new budget?",
  "options": [
    { "value": "Yes", "votes": 0 },
    { "value": "No", "votes": 0 }
  ]
}

```


* **Instructions for the Agent:**
1. Export an HTTPS function named `createSurvey` handling `PUT` requests at `/api/assembly/create`.
2. Implement Business Rules & Mapping:
* Generate a unique `id` (e.g., Firestore auto-generated document ID).
* Set the initial `status` property strictly to `'OPEN'`.
* Set `createDate` to the current server timestamp.
* Set `timeUsed` to `"0"`.
* Store the `options` array mapping the incoming payload fields safely.


3. Persist this document inside the Firestore `surveys` collection.
4. Return a `201 Created` status with the newly generated survey metadata object.



---

## 🔄 PHASE 3: DEPENDENT OPERATIONS (SEQUENTIAL)

*The following tasks require specific payload arguments (like unique identifiers) or assume data records already exist from Phase 2.*

### TASK-3.1: Implement Endpoint `GET /api/assembly/votes`

* **Execution Type:** SEQUENTIAL (Requires a valid Survey ID from Phase 2).
* **Objective:** Retrieve the specific voting details for an isolated survey using a URL query parameter.
* **Expected Request URI:** `/api/assembly/votes?id=TARGET_SURVEY_ID`
* **Instructions for the Agent:**
1. Export an HTTPS function named `getVotes` matching the route `/api/assembly/votes`.
2. Read the `id` argument from the request query parameters (`req.query.id`). If missing, return `400 Bad Request`.
3. Query the Firestore `surveys` collection for a document matching the given `id`. If no matching record is found, respond with `404 Not Found`.
4. Return a `200 OK` response containing the specific survey object matching the `Survey` frontend data contract.



### TASK-3.2: Implement Endpoint `POST /api/assembly/restart`

* **Execution Type:** SEQUENTIAL (Requires a target Survey ID).
* **Objective:** Reset an existing survey back to an open status and wipe previous vote tabulations.
* **Expected Input Payload (JSON Body):**
```json
{
  "id": "TARGET_SURVEY_ID"
}

```


* **Instructions for the Agent:**
1. Export an HTTPS function named `restartSurvey` handling `POST` requests at `/api/assembly/restart`.
2. Parse the target `id` from the request body.
3. Database Logic: Update the targeted Firestore survey document with the following values:
* Set `status` = `'OPEN'`.
* Clear statistics: Remove fields `mostVotedOption`, `mostVotedVotes`, and `mostVotedCoefficient`.
* Reset the options data array, setting all vote counts (`votesCount` or `votes`) and coefficient accumulation calculations back to `0`.


4. Return `200 OK` along with a success confirmation message status.



### TASK-3.3: Implement Endpoint `POST /api/assembly/close`

* **Execution Type:** SEQUENTIAL (Requires a target Survey ID and executes voting aggregation business logic).
* **Objective:** Formally freeze voting inputs on a survey, calculate final metrics, and compile results.
* **Expected Input Payload (JSON Body):**
```json
{
  "id": "TARGET_SURVEY_ID"
}

```


* **Instructions for the Agent:**
1. Export an HTTPS function named `closeVotes` handling `POST` requests at `/api/assembly/close`.
2. Parse the target `id` from the request body.
3. Execute Critical Business Rules (Escrutinio):
* Change the document `status` strictly to `'CLOSED'`.
* Calculate `timeUsed` by determining the difference between the current execution timestamp and the document's original `createDate`.
* Compile individual votes: For each option inside the survey, calculate the total raw headcount (`votesCount`) and sum the specific coefficient percentage weights of the properties that selected that option (`coefficientVotes`).
* Identify and set the summary fields: Determine the winning index to append `mostVotedOption`, `mostVotedVotes`, and `mostVotedCoefficient`.


4. Update the Firestore document with these finalized calculations.
5. Return `200 OK` containing the full calculated `Survey` object response.
