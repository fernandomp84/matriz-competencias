# Contexto Completo - Sistema Matriz Competencias

## 📋 Resumen del Proyecto

**Sistema Matriz Competencias** es una aplicación full-stack para procesar archivos Excel de competencias académicas de la Universidad de La Sabana. Genera JSON estructurado y matrices CSV de competencias.

### Stack Tecnológico
- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI (Python 3.11+) + Uvicorn
- **Despliegue**: Vercel (frontend) + Render (backend)
- **Control de versiones**: GitHub
- **Autenticación**: Ninguna (aplicación pública)

---

## 🚀 URLs Públicas Finales

| Componente | URL |
|-----------|-----|
| **Frontend** | https://matriz-competencias-kappa.vercel.app |
| **Dashboard** | https://matriz-competencias-kappa.vercel.app/dashboard |
| **Procesar** | https://matriz-competencias-kappa.vercel.app/procesar |
| **Backend API** | https://matriz-competencias.onrender.com |
| **API Docs** | https://matriz-competencias.onrender.com/docs |
| **Repositorio** | https://github.com/fernandomp84/matriz-competencias |

### Dominios Alternativos (mismo contenido)
- matriz-competencias-git-main-clinica-vitalia.vercel.app
- matriz-competencias-9ygxjabnh-clinica-vitalia.vercel.app

---

## 🔧 Pasos del Deployment Realizado

### Paso 1: Preparar el Repositorio GitHub
```bash
# Crear repositorio público en GitHub
# URL: https://github.com/fernandomp84/matriz-competencias
# Usuario: fernandomp84
# Email: fernandomp1984@gmail.com
```

### Paso 2: Inicializar Imports Relativos en Backend
**Problema**: Módulos no encontrados en despliegue
**Solución**: Cambiar a imports relativos

**Archivos modificados:**

1. **backend/main.py** (líneas 6-7)
```python
# Antes:
from routers import config, processing
from services import config_service

# Después:
from .routers import config, processing
from .services import config_service
```

2. **backend/routers/config.py** (línea 3)
```python
# Antes: from services import config_service
# Después: from ..services import config_service
```

3. **backend/routers/processing.py** (línea 8)
```python
# Antes: from services import ...
# Después: from ..services import ...
```

4. **Crear archivos __init__.py vacíos**
```
backend/__init__.py
backend/routers/__init__.py
backend/services/__init__.py
backend/models/__init__.py
```

### Paso 3: Actualizar TypeScript Config
**Problema**: Método .at() no soportado en ES2020
**Solución**: Actualizar tsconfig.json

**frontend/tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",  // Cambiar de ES2020
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
  }
}
```

### Paso 4: Configurar API Base URL
**frontend/src/services/api.ts** (línea 68-71)
```typescript
const client = axios.create({
  baseURL: 'https://matriz-competencias.onrender.com/api',
  timeout: 180_000,
})
```

### Paso 5: Configurar Vercel para SPA Routing
**Problema**: Error 404 en rutas como /dashboard al hacer F5
**Solución**: Agregar vercel.json

**Crear archivo: frontend/vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=(), payment=()"
        }
      ]
    }
  ]
}
```

**Ubicación importante**: Debe estar en `frontend/vercel.json` (no en raíz del proyecto) porque Vercel busca en el Root Directory

### Paso 6: Desplegar en Vercel
1. Ir a https://vercel.com/import
2. Conectar repositorio GitHub
3. Seleccionar: matriz-competencias
4. Framework: Vite
5. Root Directory: frontend
6. Deploy
7. **Resultado**: https://matriz-competencias-kappa.vercel.app

### Paso 7: Desplegar en Render
1. Ir a https://render.com
2. Conectar GitHub
3. Crear nuevo Web Service
4. Seleccionar: matriz-competencias
5. **Configuración**:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
   - Root Directory: (vacío)
6. Deploy
7. **Resultado**: https://matriz-competencias.onrender.com

---

## 📊 Configuración Actual

### Frontend (Vercel)
| Parámetro | Valor |
|-----------|-------|
| Plan | Hobby (gratis) |
| Framework | Vite |
| Root Directory | frontend/ |
| Build Command | npm run build |
| Output Directory | dist/ |
| SSL | HTTPS automático (Let's Encrypt) |
| CDN | Edge Network global (300+ datacenters) |

### Backend (Render)
| Parámetro | Valor |
|-----------|-------|
| Plan | Free tier |
| Runtime | Python 3.11+ + Uvicorn |
| Framework | FastAPI |
| Memoria RAM | 0.5 GB (compartida) |
| CPU | 0.5 vCPU (compartida) |
| Timeout | 30 segundos (Free) / 30 minutos (Pro) |
| Sleep | Duerme tras 15 min sin solicitudes (20-30s al reactivar) |

---

## ⚙️ Capacidades de Procesamiento

### Endpoints API

**POST /process/preview-tm**
- Lee solo tabla TM del Excel
- Retorna hojas disponibles y mapa TM
- Útil para verificar antes de procesar completo

**POST /process/megamatriz**
- Procesa múltiples hojas (T1, T2, T3, T5, TM)
- Valida estructuras
- Genera JSON con competencias
- Reporta errores por fila
- Calcula estadísticas

**POST /process/matrix**
- Lee JSON de Megamatriz
- Genera CSV de matriz competencias
- Exporta errores como Excel

**POST /process/full**
- Ejecuta Megamatriz + Matrix en secuencia
- Retorna ambos resultados

**GET /config/equivalencias/status**
- Verifica si equivalencias están configuradas

**PUT /config/equivalencias**
- Carga tabla de equivalencias (.xlsx)

### Tiempos de Procesamiento
- Archivos < 5 MB: 5-15 segundos
- Archivos 5-20 MB: 15-60 segundos
- Archivos 20-50 MB: 60-180 segundos

---

## ⚠️ Limitaciones Plan Free

1. **Memoria**: 0.5 GB compartida (máx 512 MB por proceso)
2. **CPU**: Compartida (0.5 vCPU equiv.)
3. **Sleep**: Instancia se duerme tras 15 min sin solicitudes
4. **Reactivación**: 20-30 segundos de demora al primer acceso después de dormir
5. **Tamaño máximo archivo**: 50 MB
6. **Concurrencia**: Máx 3-5 usuarios simultáneos
7. **Almacenamiento**: Efímero (datos se pierden al reiniciar)

---

## 🐛 Problemas Encontrados y Soluciones

### Problema 1: "Module routers not found"
**Causa**: Imports absolutos no funcionan en despliegue
**Solución**: Cambiar a imports relativos + crear __init__.py

### Problema 2: ".at() is not a function"
**Causa**: Método .at() de arrays es ES2022+
**Solución**: Actualizar tsconfig.json de ES2020 a ES2022

### Problema 3: Routing 404 en /dashboard al hacer F5
**Causa**: Vercel intenta servir /dashboard como archivo físico
**Solución**: Agregar vercel.json con rewrites para SPA routing

### Problema 4: "cd frontend: No such file or directory"
**Causa**: vercel.json en raíz intentaba cambiar directorio
**Solución**: Mover vercel.json a frontend/ (donde busca Vercel)

### Problema 5: Timeout insuficiente para archivos grandes
**Solución actual**: 180 segundos (3 minutos)
**Configurable hasta**: 30 minutos en Render Pro

---

## 📝 Commits Realizados

1. `5203f5a` - Remove University branding and update logo
2. `c7784bc` - Add security headers to frontend/vercel.json
3. `0900e54` - Add security headers to fix SNYK vulnerabilities
4. `01a1f75` - Move vercel.json to frontend directory for SPA routing
5. `6036caa` - Fix vercel.json paths for frontend root directory
6. `631b2cb` - Add vercel.json configuration for SPA routing
7. `3c54897` - Fix vercel.json build command
8. `01a1f75` - Move vercel.json to frontend directory for SPA routing

---

## 🔐 Headers de Seguridad Configurados

En `frontend/vercel.json`:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: (geolocation, microphone, camera, payment deshabilitados)

---

## 🚀 Mejoras Futuras Recomendadas

### Corto Plazo (Sin costo)
- [ ] Agregar más validaciones en frontend
- [ ] Mejorar mensajes de error
- [ ] Agregar ejemplos de archivos

### Mediano Plazo
- [ ] Upgrade Render a Plan Pro (2 GB RAM, CPU dedicada, $7/mes)
- [ ] Agregar base de datos PostgreSQL
- [ ] Implementar caché (Redis)

### Largo Plazo
- [ ] Procesamiento asincrónico con Celery + Redis
- [ ] Sistema de colas para archivos grandes
- [ ] Autenticación de usuarios
- [ ] Historial de procesamiento
- [ ] Exportación a múltiples formatos

---

## 📞 Contacto y Soporte

**Email**: innovaciondstic@unisabana.edu.co
**Repositorio**: https://github.com/fernandomp84/matriz-competencias
**Documentación API**: https://matriz-competencias.onrender.com/docs

---

## ✅ Checklist de Validación

- ✅ Frontend accesible desde Internet
- ✅ Backend procesando solicitudes
- ✅ CORS habilitado
- ✅ HTTPS en ambos servicios
- ✅ SPA Routing funcionando
- ✅ API documentada (OpenAPI/Swagger)
- ✅ Security headers configurados
- ✅ Redepliegue automático desde GitHub
- ✅ 3 usuarios pueden acceder simultáneamente
- ✅ Timeouts configurados (180s frontend, 30s+ Render)

---

## 📅 Fecha de Creación
10 de Junio de 2026

## 📊 Estado
**PRODUCCIÓN** - Aplicación live y accesible públicamente
