# ARCHIVO DE CONTEXTO - TAKEEOFF-AUTO

## Información General del Proyecto

**Proyecto**: TAKE OFF AUTO - Concesionario de vehículos (clon Fiat Turing)
**Ubicación**: `C:\proyectos de TAKEOFF\TAKEOFF-AUTO\`
**Frontend**: React + Vite + Tailwind CSS
**Backend**: PHP (API REST) con XAMPP
**Base de datos**: MySQL
**Producción**: `https://takeoffauto.online`
**Build de producción**: `dist/` (archivos estáticos)

---

## URLs

| Ambiente | Frontend | Backend | API Root |
|----------|----------|---------|----------|
| Local | `http://localhost:5173` | `http://localhost/takeoffauto-api/api/` | `http://localhost/takeoffauto-api` |
| Producción | `https://takeoffauto.online` | `https://takeoffauto.online/api/` | `https://takeoffauto.online/takeoffauto-api` |

---

## Credenciales

### Admin CRM
- **Email**: `admin@takeoffauto.com`
- **Password**: `takeoff2025`
- **Password Hash**: `$2y$10$c4VLqkrnVGbO3G/XXhMS3uDteFsnkGEpx.eiRJXV5YlEdsMAmmft.`

### Base de Datos
- **Host**: localhost (local) / configuraciones de Hostinger (producción)
- **Usuario**: root (local)
- **Base de datos**: takeoffauto

### APIs Externas (variables de entorno)
- **Google API Key**: `VITE_GOOGLE_API_KEY`
- **Google Drive Folder ID**: `VITE_GOOGLE_DRIVE_FOLDER_ID`
- **Google Sheets ID**: `VITE_GOOGLE_SHEET_ID`
- **OpenAI API Key**: `VITE_OPENAI_API_KEY`

### Redes Sociales
- **WhatsApp**: 5493516752879
- **Instagram**: @takeoff.auto
- **YouTube**: @TakeOff-p5x

---

## Detección de Entorno

El sistema detecta automáticamente si está en local o producción:
```javascript
const isLocal = hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');
```

---

## Configuración (src/config.js)

### USD_QUOTATION
- Valor: 1500 (cotización del dólar para conversión de precios)

### API_CONFIG
- BASE_URL: Punto base de la API
- API_URL: Endpoint de autos (`/cars.php`)
- UPLOAD_URL: Endpoint de subida (`/upload.php`)
- UPLOADS_URL: Directorio de uploads
- IMAGE_BASE_URL: URL base de imágenes
- ANALYTICS_URL: Endpoint de analytics
- SEND_EMAIL_URL: Endpoint de emails

### GOOGLE_CONFIG
- API_KEY: desde VITE_GOOGLE_API_KEY
- DRIVE_FOLDER_ID: desde VITE_GOOGLE_DRIVE_FOLDER_ID
- SHEET_ID: desde VITE_GOOGLE_SHEET_ID
- SHEET_RANGES: ['Diferencia de Stock!A:Z', 'Hoja 1!A:Z', 'Stock!A:Z', 'Hoja1!A:Z', 'Sheet1!A:Z']
- CACHE_TTL_MS: 5 minutos (300000 ms)

### OPENAI_CONFIG
- MODEL: gpt-4.1-mini
- TEMPERATURE: 0.7
- MAX_TOKENS: 320

---

## Rutas del Proyecto

### Rutas Públicas (Frontend)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Home | Página principal |
| `/catalogo` | Catalog | Catálogo de vehículos |
| `/car/:id` | CarDetail | Detalle de vehículo (id = ID del auto) |
| `/login` | Login | Login de usuarios |
| `/vender`ulario para vender auto | Sell | Form |
| `/credito` | Credit | Información de crédito |
| `/nosotros` | Nosotros | Página institucional |
| `/partners` | PartnersLanding | Landing para socios comerciales |
| `/partner/dashboard` | PartnerDashboard | Panel de socio |
| `/vendedor/dashboard` | SellerDashboard | Panel de vendedor |
| `/panel` | UserDashboard | Panel de usuario |

### Rutas Admin (Frontend)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/admin` | Admin | Panel de administración |
| `/admin/analytics` | Analytics | Analytics del sitio |

### Rutas CRM (Frontend)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/crm` | CRMLogin | Login CRM |
| `/crm/gestion` | CRMGestion + CRMLayout | Pipeline Kanban (gestión de clientes) |
| `/crm/dashboard` | CRMDashboard + CRMLayout | Dashboard analytics |
| `/crm/stock` | CRMStock + CRMLayout | Gestión inventario |

---

## Componentes (src/components/)

### Componentes Principales
| Archivo | Descripción |
|---------|-------------|
| Navbar.jsx + Navbar.css | Barra de navegación principal |
| Footer.jsx + Footer.css | Pie de página |
| Hero.jsx + Hero.css | Sección hero principal con video |
| Logo.jsx + Logo.css | Logo del sitio |

### Componentes de Productos
| Archivo | Descripción |
|---------|-------------|
| ProductGrid.jsx + ProductGrid.css | Grilla de productos (catálogo) |
| ProductCard.jsx + ProductCard.css | Tarjeta de producto individual |

### Componentes de Modales
| Archivo | Descripción |
|---------|-------------|
| QuoteModal.jsx + QuoteModal.css | Modal de cotización |
| FinancingModal.jsx + FinancingModal.css | Modal de financiamiento |
| PriceInquiryModal.jsx + PriceInquiryModal.css | Modal de consulta de precio |
| AdvisorModal.jsx + AdvisorModal.css | Modal de asesor (NUEVO) |
| VideoModal.jsx + VideoModal.css | Modal de video |

### Componentes de Contenido
| Archivo | Descripción |
|---------|-------------|
| BrandGrid.jsx + BrandGrid.css | Grilla de marcas disponibles |
| DeliveryCarousel.jsx + DeliveryCarousel.css | Carrusel de entregas |
| Testimonials.jsx + Testimonials.css | Testimonios de clientes |
| TipsSection.jsx + TipsSection.css | Sección de consejos |
| TrustSection.jsx + TrustSection.css | Sección de confianza |
| ZeroKmShowcase.jsx + ZeroKmShowcase.css | Exhibición 0km |
| PromiseCarousel.jsx + PromiseCarousel.css | Carrusel de promesas |
| PromiseFilmstrip.jsx + PromiseFilmstrip.css | Filmstrip de promesas |
| PurchaseProcess.jsx + PurchaseProcess.css | Proceso de compra |
| HowItWorks.jsx + HowItWorks.css | Cómo funciona |
| SimulationSection.jsx + SimulationSection.css | Sección de simulación |
| ServiceBanners.jsx + ServiceBanners.css | Banners de servicios |

### Componentes Utilitarios
| Archivo | Descripción |
|---------|-------------|
| Chatbot.jsx + Chatbot.css | Asistente virtual IA |
| CarIcons.jsx | Iconos de características |
| Reveal.jsx | Animación reveal |
| ScrollToTop.jsx | Scroll to top |

---

## Servicios (src/services/)

| Servicio | Descripción | Funciones principales |
|----------|-------------|----------------------|
| crmService.js | API del CRM | auth, clients, notes, tasks, dashboard, stock sync |
| carsService.js | API de vehículos | fetchCars, getCarById, searchCars |
| carService.js | Servicio de autos | getCarDetails, getSimilarCars |
| leadService.js | Leads y cotizaciones | submitQuote, submitLead |
| userService.js | Usuarios | register, login, updateProfile |
| analyticsService.js | Analytics | trackSearch, trackClick, getStats |
| imageService.js | Imágenes | uploadImage, deleteImage |
| syncService.js | Sincronización | syncStock, syncImages |
| mockAuthService.js | Auth mock | login, logout (desarrollo) |

---

## Scripts (scripts/)

| Script | Descripción |
|--------|-------------|
| import_cars.js | Importar autos a la base de datos (Node.js) |
| import_all_cars.cjs | Importar todos los autos (CommonJS) |
| export_local_data.php | Exportar datos locales (PHP) |

---

## APIs Backend (backend/api/)

### APIs Principales de Vehículos
| Archivo | Descripción | Métodos |
|---------|-------------|---------|
| cars.php | Listado y gestión de vehículos | GET, POST |
| list_cars.php | Listado alternativo de vehículos | GET |

### APIs de Leads y Cotizaciones
| Archivo | Descripción | Métodos |
|---------|-------------|---------|
| leads.php | Gestión de leads | GET, POST |
| submit_quote.php | Envío de cotizaciones | POST |
| price_inquiry.php | Consulta de precios | POST |
| send_financing_lead.php | Leads de financiamiento | POST |

### APIs de Gestión
| Archivo | Descripción | Métodos |
|---------|-------------|---------|
| upload.php | Subida de imágenes | POST |
| partners.php | Gestión de socios | GET, POST, PUT |
| analytics.php | Analytics del sitio | GET, POST |

### APIs CRM
| Archivo | Descripción | Métodos |
|---------|-------------|---------|
| crm_auth.php | Autenticación CRM | POST (action: login) |
| crm_clients.php | Clientes pipeline | GET, POST, PUT, DELETE |
| crm_notes.php | Notas de clientes | GET, POST |
| crm_tasks.php | Tareas | GET, POST, PUT |
| crm_dashboard.php | Estadísticas | GET (from, to) |
| crm_stock_sync.php | Sync stock | POST |

### APIs de Usuario
| Archivo | Descripción | Métodos |
|---------|-------------|---------|
| users.php | Gestión usuarios | GET, POST, PUT, DELETE |
| user_activities.php | Actividades usuario | GET, POST |

### APIs de Sincronización
| Archivo | Descripción |
|---------|-------------|
| sync_stock.php | Sincronización de stock |
| sync_images.php | Sincronización de imágenes |
| stock_sync.php | Sync de stock (alternativo) |

### APIs de Chatbot IA
| Archivo | Descripción | Métodos |
|---------|-------------|---------|
| chatbot_agent.php | Agente de chatbot IA | POST |

### APIs de Desarrollo/Debug
| Archivo | Descripción |
|---------|-------------|
| test_db_connection.php | Test de conexión a BD |
| db_check.php | Verificación de BD |
| diag_db.php | Diagnóstico de BD |
| seed_demo.php | Datos de demo |

---

## Archivos de Raíz

### Archivos de Configuración
| Archivo | Descripción |
|---------|-------------|
| package.json | Dependencias npm |
| vite.config.js | Configuración de Vite |
| tailwind.config.js | Configuración de Tailwind |
| eslint.config.js | Configuración de ESLint |
| .gitignore | Archivos ignorados por git |
| .htaccess | Configuración de Apache |

### Archivos de Datos
| Archivo | Descripción |
|---------|-------------|
| tmp_cars.json | JSON temporal de autos |
| test_output.json | Output de pruebas |
| dist.zip | Build de producción |
| dist/ | Archivos estáticos de producción |

### Utilidades PHP
| Archivo | Descripción |
|---------|-------------|
| generate_0km_specs.php | Generar especificaciones 0km con OpenAI |
| final_db_fix.php | Corrección final de base de datos |
| fix_encoding_v2.php | Reparar encoding v2 |
| fix_chars.php | Reparar caracteres |
| repair_db_encoding.php | Reparar encoding de BD |

---

## Base de Datos (database/)

### Schemas Principales
| Archivo | Descripción |
|---------|-------------|
| schema.sql | Schema base de vehículos |
| crm_schema.sql | Schema del CRM |
| user_system.sql | Sistema de usuarios |
| partners_schema.sql | Sistema de socios |

### Schemas de Datos
| Archivo | Descripción |
|---------|-------------|
| ingest_90_cars.sql | 90 vehículos (principal) |
| insert_21_cars.sql | 21 vehículos |
| insert_car_images.sql | Imágenes de autos |
| add_detailed_specs.sql | Especificaciones detalladas |

### Schemas de Soporte
| Archivo | Descripción |
|---------|-------------|
| search_analytics_table.sql | Tabla de analytics de búsqueda |
| quote_submissions_schema.sql | Schema de cotizaciones |
| seed_demo_data.sql | Datos de demo |
| repair_encoding.sql | Script de reparación de encoding |
| local_data_export.sql | Exportación de datos locales |
| schema_hostinger.sql | Schema para Hostinger |
| hostinger_full_setup.sql | Setup completo para Hostinger |

---

## Estructura CRM

### Tablas CRM (crm_schema.sql)

#### admin_users
```sql
- id (INT, PK)
- email (VARCHAR 150, UNIQUE)
- password_hash (VARCHAR 255)
- full_name (VARCHAR 100)
- role (ENUM: 'admin', 'vendedor')
- active (TINYINT 1)
- created_at (TIMESTAMP)
```

#### crm_clients
```sql
- id (INT, PK)
- full_name (VARCHAR 150)
- phone (VARCHAR 30)
- email (VARCHAR 150)
- dni (VARCHAR 20)
- stage (ENUM: 'sin_gestionar', 'primer_contacto', 'negociacion', 'venta_realizada', 'dado_de_baja')
- source (VARCHAR 50)
- car_id (INT, FK -> cars.id)
- assigned_to (INT, FK -> admin_users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### crm_notes
```sql
- id (INT, PK)
- client_id (INT, FK -> crm_clients.id)
- admin_id (INT, FK -> admin_users.id)
- content (TEXT)
- created_at (TIMESTAMP)
```

#### crm_tasks
```sql
- id (INT, PK)
- client_id (INT, FK -> crm_clients.id)
- admin_id (INT, FK -> admin_users.id)
- description (VARCHAR 500)
- due_date (DATETIME)
- completed (TINYINT 1)
- completed_at (DATETIME)
- result_note (TEXT)
- created_at (TIMESTAMP)
```

#### crm_sales
```sql
- id (INT, PK)
- client_id (INT, FK -> crm_clients.id)
- car_id (INT, FK -> cars.id)
- amount (DECIMAL 15,2)
- sale_date (DATE)
- notes (TEXT)
- created_at (TIMESTAMP)
```

#### crm_activity_log
```sql
- id (INT, PK)
- client_id (INT, FK -> crm_clients.id)
- admin_id (INT, FK -> admin_users.id)
- action (VARCHAR 50)
- from_stage (VARCHAR 30)
- to_stage (VARCHAR 30)
- detail (TEXT)
- created_at (TIMESTAMP)
```

### Pipeline Stages (Flujo de clientes)
```
sin_gestionar → primer_contacto → negociacion → venta_realizada
                           ↓
                     dado_de_baja (cancelado)
```

### Modificaciones a tabla `cars`
- `has_photos` - TINYINT(1) DEFAULT 1 (para filtrar autos sin fotos)
- `domain` - VARCHAR(20) (dominio del auto, ej: "0km", "usado")

---

## Funcionalidades CRM (Frontend)

### crmAuth
```javascript
- login(email, password)      // POST /crm_auth.php, guarda token en localStorage
- logout()                    // Limpia localStorage
- getToken()                  // Retorna token
- getAdmin()                  // Retorna datos del admin
- isLoggedIn()                // Verifica si token está vigente
```

### crmClients
```javascript
- list(stage, search)        // GET /crm_clients.php?stage=X&search=Y
- create(data)                // POST /crm_clients.php
- update(data)               // PUT /crm_clients.php
- remove(id, reason)         // DELETE /crm_clients.php (soft delete)
```

### crmNotes
```javascript
- list(clientId)              // GET /crm_notes.php?client_id=X
- create(clientId, content)  // POST /crm_notes.php
```

### crmTasks
```javascript
- list(clientId, pending)     // GET /crm_tasks.php?client_id=X&pending=1
- create(clientId, desc, dueDate)  // POST /crm_tasks.php
- complete(id, resultNote)   // PUT /crm_tasks.php
```

### crmDashboard
```javascript
- getStats(from, to)          // GET /crm_dashboard.php?from=DATE&to=DATE
```

### crmStockSync
```javascript
- sync(downloadImages)        // POST /crm_stock_sync.php
                              // Integra: Google Sheets + Drive + OpenAI
```

---

## Imágenes (public/images/)

### Imágenes de 0km (public/images/0km/)
```
- fiat-argo.jpg
- fiat-cronos.jpg
- fiat-fastback.jpg
- fiat-fastback-abarth.jpg
- fiat-mobi.jpg
- fiat-pulse.jpg
- fiat-pulse-abarth.jpg
- fiat-pulse-abarth-stranger-things.jpg
- fiat-strada.jpg
- fiat-tino.jpg
- fiat-titano.jpg
- fiat-toro.jpg
- fiat-fiorino.jpg
- fiat-600.jpg
- jeep-compass.jpg
- jeep-grand-cherokee.jpg
- jeep-renegade.jpg
- jeep-wrangler.jpg
- jeep-commander.jpg
- jeep-gladiator.jpg
- kia-carnival.jpg
- kia-k2500.jpg
- kia-k3-cross.jpg
- imgkia-k3-cross.jpg (duplicado)
- kia-k3-sedan.jpg
- kia-seltos.jpg
- kia-sportage.jpg
- ram-1500.jpg
- ram-2500.jpg
- ram-dakota.jpg
- ram-rampage.jpg
```

### Imágenes del Sitio (public/images/site/)
```
- car-meses-1.png
- car-meses-2.png
- car-meses-3.png
```

---

## Notas Importantes

1. **Token CRM**: Se almacena en localStorage con clave `crm_admin_token`
2. **Datos Admin**: Se almacenan en localStorage con clave `crm_admin_data`
3. **Detección automática**: El sistema detecta local vs producción
4. **Autos sin fotos**: Los autos con `has_photos = 0` aparecen al final del catálogo
5. **Sync de stock**: Usa Google Sheets, Google Drive, OpenAI GPT-4.1-mini
6. **Chatbot IA**: Integrado en todas las páginas públicas
7. **AdvisorModal**: Modal de contacto con asesor
8. **Build de producción**: Los archivos estáticos están en `dist/`
9. **Pipeline**: 5 stages: sin_gestionar → primer_contacto → negociacion → venta_realizada | dado_de_baja

---

## Estado de Implementación

| Componente | Estado |
|------------|--------|
| Schema MySQL | ✅ Completado |
| Backend APIs (20+) | ✅ Completado |
| Frontend CRM (6 páginas) | ✅ Completado |
| Sistema de Usuarios | ✅ Completado |
| Sistema de Partners | ✅ Completado |
| Chatbot IA | ✅ Completado |
| Chatbot Agent API | ✅ Completado |
| AdvisorModal | ✅ Completado |
| Google Sheets Sync | ✅ Completado |
| OpenAI Integration | ✅ Completado |
| Price Inquiry Modal | ✅ Completado |
| Scripts de Import | ✅ Completado |
| Build Producción (dist/) | ✅ Completado |
| Verificación | ⏳ Pendiente |

---

## Para Recargar Contexto (si el agente se rompe)

Orden de prioridad para leer archivos:
1. `ARCHIVO_DE_CONTEXTO.md` (este archivo)
2. `src/App.jsx` - Rutas completas
3. `src/config.js` - Configuración URLs y APIs
4. `database/crm_schema.sql` - Estructura CRM
5. `src/services/crmService.js` - Endpoints CRM
6. `backend/api/crm_*.php` - APIs CRM
7. `src/components/*.jsx` - Componentes
8. `backend/api/cars.php` - API de vehículos

---

## Fecha de Actualización
2026-02-25 (actualizado: chatbot_agent.php, stock_sync.php, imgkia-k3-cross.jpg)
