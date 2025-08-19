/**
 * Configuración de palabras colombianas organizadas por categorías
 * Cada categoría contiene palabras clave y sus respuestas correspondientes
 */

const colombianWords = {
  // Saludos y expresiones básicas
  greetings: {
    'parce': {
      keywords: ['parce', 'parcero', 'parcerito'],
      responses: [
        '¡Hola parce! ¿Cómo va todo?',
        '¡Qué más parce! ¿Todo bien?',
        '¡Parce! Un gusto saludarte'
      ],
      category: 'saludos'
    },
    'qué más': {
      keywords: ['qué más', 'que más', 'q más', 'q mas'],
      responses: [
        '¡Qué más! ¿Cómo va la vida?',
        '¡Qué más parce! Todo tranquilo',
        '¡Qué más! ¿Qué cuentas?'
      ],
      category: 'saludos'
    },
    'bacano': {
      keywords: ['bacano', 'bacana', 'bacán'],
      responses: [
        '¡Sí, súper bacano!',
        '¡Totalmente bacano!',
        '¡Qué bacano!'
      ],
      category: 'expresiones'
    }
  },

  // Comida y bebida
  food: {
    'arepa': {
      keywords: ['arepa', 'arepita', 'arepas'],
      responses: [
        '¡Las arepas son lo máximo! ¿Con qué te gustan?',
        '¡Arepa con todo! La mejor comida colombiana',
        '¡Uy sí! Las arepas son vida'
      ],
      category: 'comida'
    },
    'tinto': {
      keywords: ['tinto', 'tintico', 'café'],
      responses: [
        '¡Un tintico para empezar el día!',
        '¡El tinto es sagrado en Colombia!',
        '¡Tintico con panela, qué rico!'
      ],
      category: 'bebida'
    },
    'ajiaco': {
      keywords: ['ajiaco', 'ajiacito'],
      responses: [
        '¡El ajiaco es la sopa más rica del mundo!',
        '¡Ajiaco con crema y aguacate!',
        '¡Uy sí! El ajiaco es tradición'
      ],
      category: 'comida'
    }
  },

  // Expresiones coloquiales
  expressions: {
    'chévere': {
      keywords: ['chévere', 'chevere', 'chéveres'],
      responses: [
        '¡Súper chévere!',
        '¡Qué chévere!',
        '¡Totalmente chévere!'
      ],
      category: 'expresiones'
    },
    'guayabo': {
      keywords: ['guayabo', 'guayabito'],
      responses: [
        '¡Uy, qué guayabo! ¿Qué pasó?',
        '¡El guayabo es duro!',
        '¡Qué guayabo tan feo!'
      ],
      category: 'expresiones'
    },
    'maluco': {
      keywords: ['maluco', 'maluca', 'malucos'],
      responses: [
        '¡Uy sí, está maluco!',
        '¡Qué maluco!',
        '¡Está súper maluco!'
      ],
      category: 'expresiones'
    }
  },

  // Jerga y slang
  slang: {
    'chimba': {
      keywords: ['chimba', 'chimbita', 'chimbas'],
      responses: [
        '¡Qué chimba!',
        '¡Súper chimba!',
        '¡Está chimba!'
      ],
      category: 'jerga'
    },
    'gonorrea': {
      keywords: ['gonorrea', 'gonorrea'],
      responses: [
        '¡Qué gonorrea!',
        '¡Está gonorrea!',
        '¡Uy sí, qué gonorrea!'
      ],
      category: 'jerga'
    },
    'berraco': {
      keywords: ['berraco', 'berraca', 'berracos'],
      responses: [
        '¡Qué berraco!',
        '¡Súper berraco!',
        '¡Está berraco!'
      ],
      category: 'jerga'
    }
  },

  // Palabras de asombro
  amazement: {
    'uy': {
      keywords: ['uy', 'uyyy', 'uyyyy'],
      responses: [
        '¡Uy sí!',
        '¡Uy, qué tal!',
        '¡Uy, no me digas!'
      ],
      category: 'asombro'
    },
    'nojoda': {
      keywords: ['nojoda', 'no joda', 'nojodas'],
      responses: [
        '¡Nojoda! ¿En serio?',
        '¡Nojoda! Qué locura',
        '¡Nojoda! No me lo creo'
      ],
      category: 'asombro'
    }
  }
};

module.exports = colombianWords;
