# XAMPP Backend Setup - TAKE OFF AUTO

## 📋 Instrucciones de Instalación

### Paso 1: Copiar Backend a XAMPP

1. copia la carpeta `backend` completa
2. Pégala en: `C:\xampp\htdocs\`
3. Renombra la carpeta a `takeoffauto-api`

Ruta final: `C:\xampp\htdocs\takeoffauto-api\`

---

### Paso 2: Iniciar Servicios de XAMPP

1. Abre **XAMPP Control Panel**
2. Haz clic en **Start** para:
   - ✅ **Apache** (servidor web)
   - ✅ **MySQL** (base de datos)

Ambos deben mostrar **fondo verde** cuando estén corriendo.

---

### Paso 3: Crear Base de Datos

1. Abre tu navegador
2. Ve a: `http://localhost/phpmyadmin`
3. Haz clic en **"Nueva"** (o **"New"**)
4. Nombre de la base de datos: `takeoffauto_db`
5. Cotejamiento: `utf8mb4_unicode_ci`
6. Haz clic en **"Crear"**

---

### Paso 4: Importar Schema

1. En phpMyAdmin, con la base de datos `takeoffauto_db` seleccionada
2. Haz clic en la pestaña **"Importar"**
3. Haz clic en **"Seleccionar archivo"**
4. Navega a: `database/schema.sql`
5. Haz clic en **"Continuar"**

Verás las tablas `cars` y `car_images` creadas con datos de ejemplo.

---

### Paso 5: Verificar API

Abre en tu navegador:
```
http://localhost/takeoffauto-api/api/cars.php
```

Deberías ver un JSON con la lista de autos:
```json
{
  "success": true,
  "data": [...]
}
```

✅ Si ves esto, **la API funciona correctamente!**

---

## 🔧 Configuración (si es necesario)

Si la base de datos tiene credenciales diferentes:

1. Abre: `backend/config/database.php`
2. Modifica:
```php
private $host = "localhost";
private $db_name = "takeoffauto_db";
private $username = "root";        // ← Cambiar si es diferente
private $password = "";            // ← Cambiar si tienes contraseña
```

---

## 📁 Estructura de Archivos

```
C:\xampp\htdocs\takeoffauto-api\
├── api/
│   ├── cars.php        ← API principal CRUD
│   └── upload.php      ← Subida de imágenes
├── classes/
│   └── Car.php         ← Modelo Car
├── config/
│   └── database.php    ← Conexión DB
└── uploads/            ← Carpeta imágenes (se crea automáticamente)
    └── cars/
        ├── 1/
        ├── 2/
        └── ...
```

---

## 🧪 Probar Endpoints

### GET - Obtener todos los autos
```
http://localhost/takeoffauto-api/api/cars.php
```

### GET - Obtener auto por ID
```
http://localhost/takeoffauto-api/api/cars.php?id=1
```

### POST - Crear auto (usar Postman/Insomnia)
```
POST http://localhost/takeoffauto-api/api/cars.php
Content-Type: application/json

{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2024,
  "price": 380000,
  "specs": "SE • 1.8L • CVT",
  "km": 0,
  "transmission": "automatico",
  "fuel": "gasolina",
  "type": "sedan",
  "color": "blanco",
  "city": "Ciudad de México",
  "status": "disponible",
  "featured": false
}
```

---

## ⚠️ Solución de Problemas

### Error "Connection refused"
- Verifica que Apache y MySQL estén corriendo en XAMPP
- Revisa que no haya otro programa usando el puerto 80 o 3306

### Error "Access denied for user 'root'@'localhost'"
- Verifica las credenciales en `backend/config/database.php`
- En XAMPP, por defecto el user es `root` y password está vacío

### Error "404 Not Found"
- Verifica que la carpeta esté en `C:\xampp\htdocs\takeoffauto-api\`
- Verifica la URL: debe ser `http://localhost/takeoffauto-api/api/cars.php`

### CORS Error desde React
- Verifica que `Access-Control-Allow-Origin` en `database.php` tenga `http://localhost:5173`

---

## ✅ Checklist de Configuración

- [ ] XAMPP instalado
- [ ] Apache iniciado
- [ ] MySQL iniciado  
- [ ] Base de datos `takeoffauto_db` creada
- [ ] Schema importado exitosamente
- [ ] Backend copiado a `C:\xampp\htdocs\takeoffauto-api\`
- [ ] API responde en `http://localhost/takeoffauto-api/api/cars.php`
- [ ] Carpeta `uploads` tiene permisos de escritura

Una vez completado, puedes continuar actualizando el frontend React para conectarse a esta API.
