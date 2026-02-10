# ur_admin-backend
Backend project to work with ur-admin-site (frontend).

## Migración a Firebase Functions
Este proyecto ha sido migrado de Google App Engine a Firebase Functions para aprovechar la capa gratuita y mejorar la integración con el ecosistema Firebase.

### Cambios principales:
- **Estructura**: Se centralizó el enrutamiento en `handlers/router.go`.
- **Cloud Entry Point**: Se añadió `function.go` para servir como punto de entrada de la función.
- **CI/CD**: Se configuraron GitHub Actions para validación automática y despliegue continuo.
- **Versicionamiento**: Cada despliegue exitoso genera automáticamente un tag de versión en Git.

---

## Despliegue

### Despliegue Automático (GitHub Actions)
El despliegue se activa automáticamente cuando se realiza un merge a la rama `main` (despliega al entorno por defecto `production`).

### Despliegue Manual y Multi-Proyecto
Para desplegar a un proyecto específico o cliente desde una lista:
1. Ve a la pestaña **Actions** en GitHub.
2. Selecciona el workflow **Deploy to Firebase Functions**.
3. Haz clic en **Run workflow**.
4. Selecciona el **entorno/proyecto** de la lista desplegable.

#### Configuración de Proyectos (Entornos)
Para que aparezcan opciones en la lista y cada una use su propio token y ID de proyecto, debes configurar **GitHub Environments**:
1. Ve a **Settings > Environments**.
2. Crea un entorno para cada cliente/proyecto (ej: `cliente-a`, `cliente-b`).
3. Dentro de cada entorno, añade los siguientes **Secrets** y **Variables**:

| Nombre | Tipo | Descripción |
| --- | --- | --- |
| `FIREBASE_TOKEN` | Secret | Token generado mediante `firebase login:ci` para la cuenta de ese proyecto. |
| `FIREBASE_PROJECT_ID` | Variable | ID del proyecto de Firebase para ese cliente. |

### Despliegue Manual (CLI)
Si deseas realizar el despliegue localmente:
1. **Instalar Firebase CLI**: `npm install -g firebase-tools`
2. **Autenticarse**: `firebase login`
3. **Seleccionar proyecto**: `firebase use <tu-project-id>`
4. **Desplegar**: `firebase deploy --only functions`

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
- **Ejecutar localmente**: `go run main.go`
- **Correr pruebas**: `go test ./...`
- **Compilar**: `go build -o server main.go function.go`
