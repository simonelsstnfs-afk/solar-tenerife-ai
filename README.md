# SolarTenerife AI — Plataforma de Autoconsumo e Intermediación Fotovoltaica

> **Producto:** Plataforma Inteligente de Intermediación y Presupuestación Fotovoltaica  
> **Ámbito:** Isla de Tenerife (Canarias)  
> **Modelo:** Comisión a éxito (4% – 6% sobre contrato firmado) con IGIC al 0% para el cliente y 7% en intermediación  
> **Arquitectura:** Producción Ligera (Vanilla JS Modular, CSS Moderno Nativo, Cero AI-Slop, Conexión lista para Supabase y Gemini OCR)

---

## 🌟 1. Eliminación del Diseño "AI-Slop" y Mejoras de Producción

El MVP ha sido refactorizado por completo para erradicar los clichés de diseño de las plantillas genéricas de IA:

* **Estética Institucional de Alta Confianza (High-Trust B2C):**
  * Se sustituyó el tema oscuro genérico y chillón (`bg-slate-950` con degradados de neón y sombras de colores) por una paleta clara y profesional (`#FFFFFF`, `#F8FAFC`, acentos en Ámbar Solar institucional `#D97706` y Verde Esmeralda `#059669`).
  * Los propietarios de chalets y fincas en Tenerife perciben una plataforma con solvencia técnica, con referencias directas a las **Ordenanzas Municipales de 2026** y a la **Ley de Presupuestos de Canarias (IGIC 0%)**.
* **Iconografía SVG Nítida vs. Emojis:**
  * Sustitución total de los emojis informales (`☀️`, `🏝️`, `⚡`, `📄`, `🏢`) por iconos vectoriales SVG con trazo uniforme (1.75px).
* **Cumplimiento Estricto de `Modern Web Guidance`:**
  * **Modales Nativos (`<dialog>`):** Cero capas de `div` con hacks de visibilidad. Manejo automático de foco, tecla `Escape` y `::backdrop` con desenfoque nativo.
  * **Transiciones Nativas (`View Transitions API`):** Cambio fluido entre las fases del asistente mediante `document.startViewTransition()` sin librerías de animación pesadas.
  * **Cero Dependencia de CDN en Runtime:** Se eliminó la inyección pesada de `cdn.tailwindcss.com`. Todo el diseño corre en [`styles.css`](styles.css) (menos de 15 KB, ultrarrápido y sin bloqueos de red).
  * **Validación de Formularios:** Soporte nativo de pseudoclases `:user-invalid` y consentimiento explícito RGPD conforme al *Reglamento (UE) 2016/679* y la *LOPDGDD 3/2018*.

---

## 🚀 2. Ejecución Local Inmediata

No necesitas instalar Node ni dependencias pesadas:

1. **Opción Directa (Navegador):**  
   Abre el archivo `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox, Brave).
2. **Opción Servidor Local (Recomendado):**  
   Abre una terminal en esta carpeta y ejecuta:
   ```bash
   python -m http.server 3000
   ```
   Luego visita `http://localhost:3000` en tu navegador.

---

## 🔌 3. Guía de Conexión a Producción (`config.js`)

La aplicación está desacoplada mediante el archivo de configuración central `config.js`.

### Paso 1: Activar Modo Producción
En `config.js`, cambia:
```javascript
window.SOLAR_CONFIG = {
  mode: 'production', // Cambiar de 'demo' a 'production'
  ...
};
```

### Paso 2: Conectar Base de Datos (Supabase PostgreSQL)
Crea las siguientes tablas en tu proyecto de Supabase:

```sql
-- 1. Tabla de Expedientes / Leads
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  municipio TEXT NOT NULL,
  zona TEXT NOT NULL,
  tipo_cubierta TEXT NOT NULL,
  factura_mensual NUMERIC,
  consumo_anual_kwh NUMERIC,
  potencia_kwp NUMERIC,
  paneles INT,
  ahorro_anual_eur NUMERIC,
  bonif_ibi_total_eur NUMERIC,
  coste_estimado_eur NUMERIC,
  estado TEXT DEFAULT 'nuevo',
  instalador_asignado TEXT,
  importe_cerrado NUMERIC DEFAULT 0,
  comision_calculada NUMERIC DEFAULT 0,
  comision_pagada BOOLEAN DEFAULT FALSE,
  notas TEXT
);

-- 2. Tabla de Instaladores Asociados
CREATE TABLE installers (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  tier TEXT DEFAULT 'Tier 1',
  cif TEXT NOT NULL,
  zona TEXT NOT NULL,
  contacto TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT,
  comision_pct NUMERIC DEFAULT 5.0,
  contratos_firmados INT DEFAULT 0,
  comisiones_pagadas NUMERIC DEFAULT 0
);
```

Luego añade tu URL y Anon Key en `config.js`:
```javascript
supabase: {
  url: 'https://TU-PROYECTO.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### Paso 3: Conectar el Pipeline OCR con Google Gemini 2.0 Flash
Crea un Endpoint API (por ejemplo en Vercel Serverless Functions o Cloudflare Workers) que reciba el archivo y devuelva el JSON estructurado:

```typescript
// /api/ocr-factura
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('factura') as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { object } = await generateObject({
    model: google('gemini-2.0-flash'),
    schema: z.object({
      cups: z.string(),
      comercializadora: z.string(),
      potencia_contratada_kw: z.number(),
      consumo_anual_estimado_kwh: z.number(),
      gasto_medio_mensual_eur: z.number(),
      calidad_lectura: z.enum(['alta', 'media', 'baja'])
    }),
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Extrae los datos de esta factura eléctrica española.' },
        { type: 'file', data: buffer, mimeType: file.type }
      ]
    }]
  });

  return Response.json(object);
}
```

Configura la URL en `config.js`:
```javascript
endpoints: {
  ocr: '/api/ocr-factura'
}
```

---

## 📁 4. Estructura de Archivos del Proyecto

```text
solar-tenerife-mvp/
├── index.html                   # Interfaz completa B2C (Wizard) y B2B (Panel Broker)
├── styles.css                   # Diseño de alta confianza, responsivo, cero tailwind CDN
├── app.js                       # Motor reactivo, cálculos fotovoltaicos de Tenerife y CRM
├── config.js                    # Archivo de configuración central (modo demo vs producción)
├── instaladores-tenerife.json   # Base de datos de instaladores reales de la isla
└── README.md                    # Documentación y manual de despliegue
```
