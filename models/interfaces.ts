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
  timeUsed?: string;
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
