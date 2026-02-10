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
El despliegue se activa automáticamente cuando se realiza un merge a la rama `main`.

#### Variables de Configuración Necesarias:
Para que el action de despliegue funcione, debes configurar los siguientes secretos y variables en tu repositorio de GitHub (**Settings > Secrets and variables > Actions**):

| Nombre | Tipo | Descripción |
| --- | --- | --- |
| `FIREBASE_TOKEN` | Secret | Token generado mediante `firebase login:ci`. |
| `FIREBASE_PROJECT_ID` | Variable | ID del proyecto de Firebase (ej: `mi-proyecto-123`). |
| `GITHUB_TOKEN` | Secret | (Automático) Requerido para la creación de tags. |

### Despliegue Manual
Si deseas realizar el despliegue sin usar los Actions:

1. **Instalar Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Autenticarse**:
   ```bash
   firebase login
   ```
3. **Seleccionar proyecto**:
   ```bash
   firebase use <tu-project-id>
   ```
4. **Desplegar**:
   ```bash
   firebase deploy --only functions
   ```

---

## Guía para Múltiples Clientes/Proyectos
Para usar este repositorio con diferentes clientes o proyectos:

1. **Parametrización**: Cambia el `FIREBASE_PROJECT_ID` en las variables de GitHub para cada cliente.
2. **Entornos**: Se recomienda usar **GitHub Environments** para manejar diferentes configuraciones (Dev, Staging, Prod) y sus respectivos tokens.
3. **Variables de Entorno**: Las variables que antes estaban en `.env` deben configurarse en Firebase:
   ```bash
   firebase functions:config:set service.key="valor"
   ```
   O usando Secret Manager si son datos sensibles.

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

### Comandos Go
- **Ejecutar localmente**: `go run main.go`
- **Correr pruebas**: `go test ./...`
- **Compilar**: `go build -o server main.go function.go`

### Docker (Opcional)
```bash
docker build -t ur-admin-backend .
docker run -p 8080:8080 ur-admin-backend
```
