/**
 * SolarTenerife AI — Configuración del Sistema (Production & Integration Ready)
 * 
 * Para pasar este proyecto a producción real:
 * 1. Cambia `mode: 'production'`
 * 2. Rellena las credenciales de Supabase y las URLs de tus Server Actions o Webhooks.
 * 3. Todas las funciones de la aplicación leerán automáticamente estos parámetros.
 */

window.SOLAR_CONFIG = {
  // Modo de ejecución:
  // 'demo'       -> Utiliza persistencia local (localStorage) y simulación de OCR ultrarrápida.
  // 'production' -> Conecta con Supabase PostgreSQL, Storage para facturas y Gemini 2.0 Flash API.
  mode: 'demo',

  // 1. Conexión con Base de Datos y Storage (Supabase)
  supabase: {
    url: 'https://TU-PROYECTO.supabase.co',
    anonKey: 'TU-SUPABASE-ANON-KEY',
    tables: {
      leads: 'leads',
      installers: 'installers',
      commissions: 'commissions'
    },
    storageBucket: 'facturas-privadas' // Bucket con RLS para almacenamiento cifrado de PDFs
  },

  // 2. Endpoints de Inteligencia Artificial & Comunicaciones
  endpoints: {
    // Endpoint para extracción OCR de facturas con Gemini 2.0 Flash / Vision AI
    // (Acepta multipart/form-data con archivo PDF/imagen y devuelve JSON estructurado)
    ocr: '/api/ocr-factura',

    // Webhook para Meta WhatsApp Cloud API (notificación instantánea al instalador asignado)
    whatsappWebhook: 'https://graph.facebook.com/v19.0/TU_PHONE_NUMBER_ID/messages',
    whatsappToken: '',

    // Webhook para emails transaccionales (Resend / SendGrid / Postmark)
    emailWebhook: 'https://api.resend.com/emails',
    emailToken: ''
  },

  // 3. Parámetros de Negocio Fotovoltaico e Incentivos en Tenerife (2026)
  business: {
    nombrePlataforma: 'SolarTenerife AI',
    entidadResponsable: 'SolarTenerife Intermediación Energética S.L. (En constitución)',
    cifProvisional: 'B-38990012',
    domicilio: 'Santa Cruz de Tenerife, Islas Canarias, España',
    emailContacto: 'hola@solartenerife.es',
    telefonoSoporte: '+34 922 00 22 44',
    whatsappSoporte: '+34 680 00 00 00',

    // Parámetros económicos insulares
    comisionPactadaDefaultPct: 5.0, // 5% sobre el contrato llave en mano cerrado
    igicComisionPct: 7.0,           // 7% IGIC en Canarias para la factura de comisión
    costeKwpLlaveEnManoEur: 1350,   // Coste medio de mercado en Tenerife por kWp instalado
    precioKwhMedioCanariasEur: 0.24,// Precio medio energía en Canarias con impuestos (€/kWh)
    ibiMedioUnifamiliarEur: 450,    // IBI anual medio en viviendas unifamiliares de Tenerife
    potenciaPanelWatt: 450          // Módulos fotovoltaicos monocristalinos Tier 1 estándar (450W)
  }
};
