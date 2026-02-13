# ur_admin-backend
Backend project to work with ur-admin-site (frontend).

## Migración a Node.js y Firebase Functions
Este proyecto ha sido migrado de Go a Node.js (Express) sobre Firebase Functions para aprovechar la capa gratuita y mejorar la integración con el ecosistema Firebase.

### Cambios principales:
- **Tecnología**: Migración completa de Go 1.22 a Node.js 20.
- **Framework**: Uso de Express para el manejo de rutas y middlewares.
- **Estructura**: Se centralizó el enrutamiento en `handlers/router.js`.
- **Cloud Entry Point**: `index.js` sirve como punto de entrada de la función.
- **CI/CD**: Se actualizaron los GitHub Actions para usar Node.js y npm.
- **Versicionamiento**: Cada despliegue exitoso genera automáticamente un tag de versión en Git.

---

## Despliegue

### Despliegue Automático (GitHub Actions)
El despliegue se activa automáticamente cuando se realiza un merge a la rama `main` (despliega al entorno por defecto `production-tss`).

### Despliegue Manual y Multi-Proyecto
Para desplegar a un proyecto específico o cliente desde una lista:
1. Ve a la pestaña **Actions** en GitHub.
2. Selecciona el workflow **Deploy to Firebase Functions**.
3. Haz clic en **Run workflow**.
4. Selecciona el entorno deseado: `production-tss` o `production-alm181`.

#### Configuración de Proyectos (Entornos)
Para que el despliegue funcione, debes configurar los **GitHub Environments** correspondientes (`production-tss`, `production-alm181`) y añadir los siguientes **Secrets** y **Variables**:

| Nombre | Tipo | Descripción |
| --- | --- | --- |
| `FIREBASE_TOKEN` | Secret | **Contenido completo del JSON** de la cuenta de servicio de GCP/Firebase con permisos de editor/desplegador. |
| `FIREBASE_PROJECT_ID` | Variable | ID del proyecto de Firebase para ese cliente. |

> **Nota sobre Seguridad**: Se recomienda crear una cuenta de servicio específica para despliegues con los permisos mínimos necesarios (Firebase Admin, Cloud Functions Admin, etc.) en lugar de usar el token de usuario.

### Despliegue Manual (CLI)
Si deseas realizar el despliegue localmente:
1. **Instalar Firebase CLI**: `npm install -g firebase-tools`
2. **Autenticarse**: `firebase login`
3. **Seleccionar proyecto**: `firebase use <tu-project-id>`
4. **Desplegar**: `npm run deploy`

---

## Conexión desde Angular
Si tu interfaz está en Angular (desplegada en Firebase Hosting):

### Si están en el mismo proyecto Firebase:
Configura el archivo `firebase.json` de tu proyecto Angular para redirigir las llamadas:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "Handler"
      }
    ]
  }
}
```
En Angular, usa `/api` como base para tus peticiones HTTP.

### Si están en proyectos diferentes:
Debes usar la URL completa proporcionada por Firebase tras el despliegue:
`https://<region>-<project-id>.cloudfunctions.net/Handler/api/...`

Asegúrate de que el CORS esté configurado (ya incluido en este backend) para permitir el dominio de tu aplicación Angular.

---

## Desarrollo Local
- **Instalar dependencias**: `npm install`
- **Ejecutar localmente**: `npm start` o `npm run dev`
- **Correr pruebas**: `npm test`
