# 🇨🇴 Bot Colombiano - Sistema de Palabras

Este sistema permite que el bot reconozca y responda a palabras colombianas de manera inteligente y organizada.

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── colombianWords.js      # Configuración de palabras por categorías
├── flows/
│   ├── colombianWordsFlow.js  # Flujo principal del bot
│   └── index.js               # Exportación de flujos
├── responses/
│   └── index.js               # Exportación de respuestas
├── utils/
│   ├── wordMatcher.js         # Utilidad para hacer match de palabras
│   └── responseSelector.js    # Selector inteligente de respuestas
└── app.js                     # Aplicación principal
```

## 🎯 Funcionalidades

### 1. **Reconocimiento de Palabras**
- Detecta automáticamente palabras colombianas en el texto del usuario
- Soporta variaciones y sinónimos
- Búsqueda inteligente por patrones

### 2. **Categorías Organizadas**
- **Saludos**: parce, qué más, bacano
- **Comida**: arepa, tinto, ajiaco
- **Expresiones**: chévere, guayabo, maluco
- **Jerga**: chimba, gonorrea, berraco
- **Asombro**: uy, nojoda

### 3. **Respuestas Inteligentes**
- Respuestas aleatorias para cada palabra
- Respuestas combinadas para múltiples palabras
- Sugerencias relacionadas automáticas

### 4. **Comandos del Bot**
- `hola` - Inicio y bienvenida
- `ayuda` - Ver todas las categorías
- `categorías` - Lista de categorías disponibles
- `estadísticas` - Información del bot
- `buscar [palabra]` - Búsqueda específica

### 5. **Sistema de Citas**
- `cita` - Agendar nueva cita
- `horarios` - Ver horarios disponibles
- `mis citas` - Ver mis citas
- `cancelar` - Cancelar cita
- `ayuda citas` - Ayuda del sistema de citas

## 🚀 Cómo Usar

### Ejecutar el Bot
```bash
# Desde la raíz del proyecto
node src/app.js

# O usar los scripts del package.json
npm run start:colombian
npm run dev
```

### Sistema de Citas
El bot incluye un sistema completo de agendamiento:

1. **Agendar Cita**: Escribe `cita` y sigue el proceso
2. **Ver Horarios**: Escribe `horarios` para consultar disponibilidad
3. **Confirmar**: El bot pide confirmación y tienes 5 minutos
4. **Cancelar**: Puedes cancelar en cualquier momento

**Proceso de agendamiento:**
- Selecciona fecha (DD/MM/YYYY)
- Selecciona hora (HH:MM)
- Confirma la cita
- Recibe confirmación con ID único

### Agregar Nuevas Palabras
Edita `src/config/colombianWords.js`:

```javascript
// Agregar nueva categoría
newCategory: {
  'nuevaPalabra': {
    keywords: ['palabra', 'variacion'],
    responses: [
      'Respuesta 1',
      'Respuesta 2',
      'Respuesta 3'
    ],
    category: 'nueva_categoria'
  }
}
```

### Personalizar Respuestas
Cada palabra puede tener múltiples respuestas que se seleccionan aleatoriamente:

```javascript
'parce': {
  keywords: ['parce', 'parcero'],
  responses: [
    '¡Hola parce! ¿Cómo va todo?',
    '¡Qué más parce! ¿Todo bien?',
    '¡Parce! Un gusto saludarte'
  ],
  category: 'saludos'
}
```

## 🔧 Configuración Avanzada

### Modificar Categorías
Las categorías se pueden personalizar en `colombianWords.js`:

```javascript
const colombianWords = {
  // Tu nueva categoría
  customCategory: {
    // Palabras aquí
  }
};
```

### Agregar Nuevas Utilidades
Extiende las clases en `utils/`:

```javascript
// En wordMatcher.js
class WordMatcher {
  // Agregar nuevos métodos
  newMethod() {
    // Tu lógica aquí
  }
}
```

## 📊 Estadísticas y Monitoreo

El bot proporciona estadísticas en tiempo real:
- Total de palabras por categoría
- Categorías disponibles
- Respuestas generadas

## 🎨 Personalización de UI

### Emojis y Formato
Las respuestas usan emojis y formato Markdown de WhatsApp:
- **Negrita**: `*texto*`
- **Cursiva**: `_texto_`
- **Tachado**: `~texto~`

### Estructura de Respuestas
```javascript
[
  '📝 Título principal',
  '',
  '• Punto 1',
  '• Punto 2',
  '',
  '💡 Información adicional'
]
```

## 🔍 Búsqueda y Filtrado

### Búsqueda por Patrón
```javascript
// Buscar palabras que contengan "par"
const matches = wordMatcher.searchByPattern('par');
```

### Filtrado por Categoría
```javascript
// Obtener todas las palabras de saludos
const saludos = wordMatcher.getWordsByCategory('saludos');
```

## 🚨 Manejo de Errores

El sistema incluye manejo robusto de errores:
- Validación de entrada
- Respuestas por defecto
- Logging de errores
- Fallbacks automáticos

## 📈 Escalabilidad

El sistema está diseñado para ser fácilmente escalable:
- Arquitectura modular
- Configuración centralizada
- Fácil agregar nuevas palabras
- Sistema de plugins extensible

## 🤝 Contribuir

Para agregar nuevas palabras o funcionalidades:

1. Edita `src/config/colombianWords.js`
2. Agrega nuevas utilidades en `src/utils/`
3. Extiende los flujos en `src/flows/`
4. Prueba con `node src/app.js`

## 📝 Notas Importantes

- Las palabras se buscan de manera case-insensitive
- Se soportan múltiples variaciones por palabra
- Las respuestas se seleccionan aleatoriamente
- El sistema es extensible y mantenible
- Incluye logging y monitoreo automático

¡Disfruta explorando el mundo de las palabras colombianas! 🇨🇴
