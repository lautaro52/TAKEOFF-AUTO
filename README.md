# TAKE OFF AUTO - FIAT TURING

Este es el proyecto de la web clonada de Kavak para **TAKE OFF AUTO**.

## Características
- Catálogo de autos dinámico.
- Formulario de cotización de vehículos con carga de fotos.
- Backend en PHP para gestión de leads y cotizaciones.
- Integración con base de datos MySQL.
- Notificaciones automáticas por correo electrónico.

## Tecnologías
- **Frontend**: React, Vite, Lucide React.
- **Backend**: PHP (API REST).
- **Base de Datos**: MySQL.

## Configuración Local
1. Clona el repositorio.
2. Asegúrate de tener XAMPP o similar con Apache y MySQL.
3. Importa el esquema de la base de datos desde la carpeta `database/`.
4. Configura las credenciales en `backend/config/database.php`.
5. Ejecuta `npm install` y `npm run dev` para el frontend.
6. El backend debe estar accesible (por defecto configurado para `localhost:8000`).

## Despliegue en Hostinger
El proyecto está configurado para detectar automáticamente si se encuentra en un entorno local o en Hostinger según el `HTTP_HOST`.
