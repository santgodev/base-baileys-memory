/**
 * Utilidad para seleccionar y generar respuestas inteligentes
 * basadas en las palabras colombianas encontradas
 */

const WordMatcher = require('./wordMatcher');
const colombianWords = require('../config/colombianWords');

class ResponseSelector {
  constructor() {
    this.wordMatcher = new WordMatcher();
  }

  /**
   * Genera una respuesta basada en el texto del usuario
   * @param {string} userText - Texto del usuario
   * @returns {Object} Objeto con la respuesta y metadatos
   */
  generateResponse(userText) {
    const matches = this.wordMatcher.findMatches(userText);
    
    if (matches.length === 0) {
      return this.getDefaultResponse();
    }

    // Si hay múltiples palabras, crear una respuesta combinada
    if (matches.length > 1) {
      return this.generateCombinedResponse(matches);
    }

    // Respuesta para una sola palabra
    return this.generateSingleResponse(matches[0]);
  }

  /**
   * Genera respuesta para una sola palabra
   * @param {Object} match - Objeto de palabra encontrada
   * @returns {Object} Respuesta generada
   */
  generateSingleResponse(match) {
    const response = this.wordMatcher.getResponse(match.originalKey);
    const wordInfo = this.wordMatcher.getWordInfo(match.originalKey);
    
    return {
      type: 'single_word',
      response: response,
      word: match.originalKey,
      category: wordInfo.category,
      confidence: 1.0,
      suggestions: this.getSuggestions(match.originalKey),
      metadata: {
        originalText: match.keyword,
        category: wordInfo.category
      }
    };
  }

  /**
   * Genera respuesta combinada para múltiples palabras
   * @param {Array} matches - Array de palabras encontradas
   * @returns {Object} Respuesta combinada
   */
  generateCombinedResponse(matches) {
    const responses = [];
    const categories = new Set();
    const words = [];

    matches.forEach(match => {
      const response = this.wordMatcher.getResponse(match.originalKey);
      const wordInfo = this.wordMatcher.getWordInfo(match.originalKey);
      
      if (response) {
        responses.push(response);
        categories.add(wordInfo.category);
        words.push(match.originalKey);
      }
    });

    // Crear respuesta combinada
    let combinedResponse = '';
    if (responses.length === 2) {
      combinedResponse = `${responses[0]} Y también: ${responses[1]}`;
    } else if (responses.length > 2) {
      combinedResponse = `${responses[0]} ¡Y veo que usas mucho colombiano! ${responses[1]} Y además: ${responses[2]}`;
    } else {
      combinedResponse = responses[0];
    }

    return {
      type: 'multiple_words',
      response: combinedResponse,
      words: words,
      categories: Array.from(categories),
      confidence: 0.9,
      suggestions: this.getCombinedSuggestions(words),
      metadata: {
        matchCount: matches.length,
        categories: Array.from(categories)
      }
    };
  }

  /**
   * Obtiene sugerencias relacionadas con una palabra
   * @param {string} wordKey - Clave de la palabra
   * @returns {Array} Array de sugerencias
   */
  getSuggestions(wordKey) {
    const wordInfo = this.wordMatcher.getWordInfo(wordKey);
    if (!wordInfo) return [];

    const category = wordInfo.category;
    const suggestions = [];

    // Agregar palabras de la misma categoría
    Object.values(colombianWords).forEach(cat => {
      Object.entries(cat).forEach(([key, data]) => {
        if (data.category === category && key !== wordKey) {
          suggestions.push({
            word: key,
            category: data.category,
            example: data.responses[0]
          });
        }
      });
    });

    return suggestions.slice(0, 3); // Máximo 3 sugerencias
  }

  /**
   * Obtiene sugerencias combinadas para múltiples palabras
   * @param {Array} words - Array de palabras
   * @returns {Array} Array de sugerencias combinadas
   */
  getCombinedSuggestions(words) {
    const suggestions = new Set();
    
    words.forEach(word => {
      const wordSuggestions = this.getSuggestions(word);
      wordSuggestions.forEach(suggestion => {
        suggestions.add(JSON.stringify(suggestion));
      });
    });

    return Array.from(suggestions).map(s => JSON.parse(s)).slice(0, 5);
  }

  /**
   * Genera respuesta por defecto cuando no se encuentran palabras colombianas
   * @returns {Object} Respuesta por defecto
   */
  getDefaultResponse() {
    const defaultResponses = [
      '¡Hola! ¿Qué tal? ¿Quieres que te enseñe algunas palabras colombianas?',
      '¡Saludos! ¿Conoces palabras colombianas como "parce" o "chévere"?',
      '¡Hola! ¿Te gustaría aprender expresiones colombianas?',
      '¡Qué más! ¿Quieres que te explique el significado de palabras colombianas?'
    ];

    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    
    return {
      type: 'default',
      response: defaultResponses[randomIndex],
      confidence: 0.5,
      suggestions: this.getRandomSuggestions(),
      metadata: {
        reason: 'no_colombian_words_found'
      }
    };
  }

  /**
   * Obtiene sugerencias aleatorias de palabras colombianas
   * @returns {Array} Array de sugerencias aleatorias
   */
  getRandomSuggestions() {
    const categories = this.wordMatcher.getCategories();
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = this.wordMatcher.getWordsByCategory(randomCategory);
    
    return words.slice(0, 3).map(word => {
      const wordInfo = this.wordMatcher.getWordInfo(word);
      return {
        word: word,
        category: wordInfo.category,
        example: wordInfo.responses[0]
      };
    });
  }

  /**
   * Obtiene estadísticas de uso de palabras
   * @returns {Object} Estadísticas de las palabras
   */
  getStats() {
    const stats = {};
    const categories = this.wordMatcher.getCategories();
    
    categories.forEach(category => {
      const words = this.wordMatcher.getWordsByCategory(category);
      stats[category] = {
        count: words.length,
        words: words
      };
    });

    return stats;
  }

  /**
   * Busca palabras por patrón y genera sugerencias
   * @param {string} pattern - Patrón a buscar
   * @returns {Object} Respuesta con sugerencias
   */
  searchAndSuggest(pattern) {
    const matches = this.wordMatcher.searchByPattern(pattern);
    
    if (matches.length === 0) {
      return {
        type: 'no_matches',
        response: `No encontré palabras que coincidan con "${pattern}". ¿Podrías ser más específico?`,
        suggestions: this.getRandomSuggestions()
      };
    }

    const suggestions = matches.slice(0, 5).map(match => ({
      word: match.originalKey,
      category: match.wordData.category,
      example: match.wordData.responses[0]
    }));

    return {
      type: 'search_results',
      response: `Encontré ${matches.length} palabra(s) relacionada(s) con "${pattern}":`,
      suggestions: suggestions,
      metadata: {
        searchPattern: pattern,
        resultCount: matches.length
      }
    };
  }
}

module.exports = ResponseSelector;
