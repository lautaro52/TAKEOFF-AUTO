# ARCHIVO DE CONTEXTO - TAKEEOFF-AUTO

## Información General del Proyecto

**Proyecto**: TAKE OFF AUTO - Concesionario de vehículos (clon Fiat Turing)
**Ubicación**: `C:\proyectos de TAKEOFF\TAKEOFF-AUTO\`
**Frontend**: React + Vite + Tailwind CSS
**Backend**: PHP (API REST) con XAMPP
**Base de datos**: MySQL
**Producción**: `https://takeoffauto.online`

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

## Rutas del Proyecto

### Rutas Públicas (Frontend)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Home | Página principal |
| `/catalogo` | Catalog | Catálogo de vehículos |
| `/car/:id` | CarDetail | Detalle de vehículo |
| `/login` | Login | Login de usuarios |
| `/vender` | Sell | Formulario para vender |
| `/credito` | Credit | **Página de crédito y financiamiento** (TABS: usados/0km, calculadora, FAQs) |
| `/nosotros` | Nosotros | Página institucional |
| `/partners` | PartnersLanding | Landing para socios |
| `/partner/dashboard` | PartnerDashboard | Panel de socio |
| `/vendedor/dashboard` | SellerDashboard | Panel de vendedor |
| `/panel` | UserDashboard | Panel de usuario |

### Rutas Admin
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/admin` | Admin | Panel de administración |
| `/admin/analytics` | Analytics | Analytics del sitio |

### Rutas CRM
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/crm` | CRMLogin | Login CRM |
| `/crm/gestion` | CRMGestion + CRMLayout | Pipeline Kanban |
| `/crm/dashboard` | CRMDashboard + CRMLayout | Dashboard analytics |
| `/crm/stock` | CRMStock + CRMLayout | Gestión inventario |

---

## Página /credito - Detalles

La página de crédito es una de las más importantes del sitio. Aquí están los detalles:

### Características:
- **Two tabs**: 'usados' y '0km' 
- **Hero section** con video de fondo
- **Calculadora de financiamiento** (carga autos dinámicamente)
- **Carrusel infinito** con autos para financiar
- **Auto-play** para carrusel (2.5s intervalo)
- **FAQ** con 4 preguntas frecuentes
- **Secciones de beneficios** (azul para usados, verde para 0km)
- **ZeroKmShowcase** integrado
- **PromiseCarousel** integrado
- **Modales**: AdvisorModal y PriceInquiryModal

### Estados:
- `activeTab`: 'usados' | '0km'
- `openFaq`: índice del FAQ abierto
- `carouselIndex`: índice del carrusel
- `financingCars`: array de autos cargados dinámicamente
- `isAdvisorModalOpen`: boolean
- `isPriceModalOpen`: boolean

### Componentes utilizados:
- `DeliveryCarousel`
- `ZeroKmShowcase`
- `PromiseCarousel`
- `Reveal`
- `AdvisorModal`
- `PriceInquiryModal`
- `getCars()` desde carsService

### Assets utilizados:
- `loan-visual.png`
- `credit-hero.jpg`
- `video-credit.mp4`
- `credit-poster.jpg`

---

## Configuración (src/config.js)

### USD_QUOTATION
- Valor: 1500

### API_CONFIG
- BASE_URL, API_URL, UPLOAD_URL, UPLOADS_URL, IMAGE_BASE_URL, ANALYTICS_URL, SEND_EMAIL_URL
- WHATSAPP_NUMBER: "5493516752879"
- WHATSAPP_LINK: "https://wa.me/5493516752879"
- INSTAGRAM_LINK: "https://www.instagram.com/takeoff.auto/"
- YOUTUBE_LINK: "https://www.youtube.com/@TakeOff-p5x"

### GOOGLE_CONFIG
- API_KEY, DRIVE_FOLDER_ID, SHEET_ID
- SHEET_RANGES: ['Diferencia de Stock!A:Z', 'Hoja 1!A:Z', 'Stock!A:Z', 'Hoja1!A:Z', 'Sheet1!A:Z']
- CACHE_TTL_MS: 300000 (5 minutos)

### OPENAI_CONFIG
- MODEL: gpt-4.1-mini
- TEMPERATURE: 0.7
- MAX_TOKENS: 320

---

## Componentes (src/components/)

### Componentes Principales
- Navbar.jsx + Navbar.css
- Footer.jsx + Footer.css
- Hero.jsx + Hero.css
- Logo.jsx + Logo.css

### Componentes de Productos
- ProductGrid.jsx + ProductGrid.css
- ProductCard.jsx + ProductCard.css

### Componentes de Modales
- QuoteModal.jsx + QuoteModal.css
- FinancingModal.jsx + FinancingModal.css
- PriceInquiryModal.jsx + PriceInquiryModal.css
- AdvisorModal.jsx + AdvisorModal.css
- VideoModal.jsx + VideoModal.css

### Componentes de Contenido
- BrandGrid.jsx + BrandGrid.css
- DeliveryCarousel.jsx + DeliveryCarousel.css
- Testimonials.jsx + Testimonials.css
- TipsSection.jsx + TipsSection.css
- TrustSection.jsx + TrustSection.css
- ZeroKmShowcase.jsx + ZeroKmShowcase.css
- PromiseCarousel.jsx + PromiseCarousel.css
- PromiseFilmstrip.jsx + PromiseFilmstrip.css
- PurchaseProcess.jsx + PurchaseProcess.css
- HowItWorks.jsx + HowItWorks.css
- SimulationSection.jsx + SimulationSection.css
- ServiceBanners.jsx + ServiceBanners.css

### Componentes Utilitarios
- Chatbot.jsx + Chatbot.css
- CarIcons.jsx
- Reveal.jsx
- ScrollToTop.jsx

---

## Servicios (src/services/)

| Servicio | Descripción |
|----------|-------------|
| crmService.js | API del CRM (auth, clients, notes, tasks, dashboard, stock sync) |
| carsService.js | API de vehículos |
| carService.js | Servicio de autos |
| leadService.js | Leads y cotizaciones |
| userService.js | Usuarios |
| analyticsService.js | Analytics |
| imageService.js | Imágenes |
| syncService.js | Sincronización |
| mockAuthService.js | Auth mock |

---

## APIs Backend (backend/api/)

### APIs Principales de Vehículos
- cars.php
- list_cars.php

### APIs de Leads y Cotizaciones
- leads.php
- submit_quote.php
- price_inquiry.php
- send_financing_lead.php

### APIs de Gestión
- upload.php
- partners.php
- analytics.php

### APIs CRM
- crm_auth.php
- crm_clients.php
- crm_notes.php
- crm_tasks.php
- crm_dashboard.php
- crm_stock_sync.php
- crm_reorder_photos.php (NUEVO)
- migrate_tasks.php (NUEVO)

### APIs de Usuario
- users.php
- user_activities.php

### APIs de Sincronización
- sync_stock.php
- sync_images.php
- stock_sync.php

### APIs de Chatbot IA
- chatbot_agent.php

### APIs de Desarrollo/Debug
- test_db_connection.php
- db_check.php
- diag_db.php
- seed_demo.php
- debug_preview.php (NUEVO)
- debug_clio.php (NUEVO)
- fix_analytics_table.php (NUEVO)
- debug_report_generator.php
- debug_encoding.php
- debug_159.php
- debug_159_km.php
- debug_159_data.php
- check_innova.php
- cars_test.php
- apply_schema.php
- apply_schema_v2.php
- apply_user_system.php

---

## Base de Datos (database/)

### Schemas Principales
- schema.sql
- crm_schema.sql
- user_system.sql
- partners_schema.sql

### Schemas de Datos
- ingest_90_cars.sql
- insert_21_cars.sql
- insert_car_images.sql
- add_detailed_specs.sql

### Schemas de Soporte
- search_analytics_table.sql
- quote_submissions_schema.sql
- seed_demo_data.sql
- repair_encoding.sql
- local_data_export.sql
- schema_hostinger.sql
- hostinger_full_setup.sql

---

## Estructura CRM

### Tablas CRM
- `admin_users` - Usuarios admin
- `crm_clients` - Clientes pipeline
- `crm_notes` - Notas
- `crm_tasks` - Tareas
- `crm_sales` - Ventas
- `crm_activity_log` - Log de actividad

### Pipeline Stages
`sin_gestionar` → `primer_contacto` → `negociacion` → `venta_realizada` | `dado_de_baja`

### Modificaciones a tabla `cars`
- `has_photos` - TINYINT(1)
- `domain` - VARCHAR(20)

---

## Estado de Implementación

| Componente | Estado |
|------------|--------|
| Schema MySQL | ✅ Completado |
| Backend APIs | ✅ Completado |
| Frontend CRM | ✅ Completado |
| Sistema de Usuarios | ✅ Completado |
| Sistema de Partners | ✅ Completado |
| Chatbot IA | ✅ Completado |
| Google Sheets Sync | ✅ Completado |
| OpenAI Integration | ✅ Completado |
| Price Inquiry Modal | ✅ Completado |
| AdvisorModal | ✅ Completado |
| Página /credito | ✅ Completado |
| crm_reorder_photos | ✅ Completado |
| migrate_tasks | ✅ Completado |
| debug_clio, debug_preview | ✅ Completado |
| fix_analytics_table | ✅ Completado |
| Scripts de Import | ✅ Completado |
| Verificación | ⏳ Pendiente |

---

## Notas Importantes

1. Token CRM: localStorage ('crm_admin_token')
2. Datos Admin: localStorage ('crm_admin_data')
3. Detección automática de entorno
4. Autos sin fotos aparecen al final del catálogo
5. Sync de stock: Google Sheets + Drive + OpenAI
6. Chatbot IA integrado en todas las páginas públicas
7. /credito es una página clave con tabs y modales

---

## Para Recargar Contexto

Si el agente se rompe, leer en orden:
1. `ARCHIVO_DE_CONTEXTO.md` (este archivo)
2. `src/App.jsx` - Rutas
3. `src/config.js` - Configuración
4. `src/pages/Credit.jsx` - Página de crédito
5. `database/crm_schema.sql` - Estructura CRM
6. `src/services/crmService.js` - Endpoints CRM
7. `backend/api/crm_*.php` - APIs CRM
8. `src/components/AdvisorModal.jsx` - Modal de asesor
9. `src/components/PriceInquiryModal.jsx` - Modal de precio

---

## Fecha de Actualización
2026-02-25 (actualizado con crm_reorder_photos.php, debug_preview.php, debug_clio.php, fix_analytics_table.php, migrate_tasks.php)
