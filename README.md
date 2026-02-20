# TAKE OFF AUTO - FIAT TURING

Este es el proyecto de la web clonada de TAKEOFF AUTO para **TAKE OFF AUTO**.

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

## Configuración para Compañeros (90 Autos)
Para que el catálogo muestre los 90 autos cargados actualmente, sigue estos pasos:

1. **Base de Datos**: Importa el archivo `database/ingest_90_cars.sql`. Este archivo contiene la estructura y los datos de las 90 unidades optimizadas.
2. **Backend**: Asegúrate de que las credenciales en `backend/config/database.php` apunten a tu base de datos local.
3. **Frontend**: Ejecuta `npm install` y `npm run dev`.
4. **Catálogo**: El sistema detectará automáticamente los 90 autos si la importación del SQL fue exitosa.

## Estado del Proyecto
- **Versión Definitiva**: Esta es la versión final optimizada donde todo funciona correctamente.
- **Catálogo Bloqueado**: El panel de administración tiene las funciones de edición/borrado desactivadas para proteger el inventario de 90 unidades.
- **Precios**: Los precios inferiores a 100,000 se consideran en USD y se convierten automáticamente según la cotización en `src/config.js`.

## Despliegue en Hostinger
El proyecto detecta automáticamente el entorno. En producción, utiliza `https://takeoffauto.online`.

