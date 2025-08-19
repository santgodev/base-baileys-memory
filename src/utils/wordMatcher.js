/**
 * Utilidad para hacer match de palabras colombianas en el texto del usuario
 */

const colombianWords = require('../config/colombianWords');

class WordMatcher {
  constructor() {
    this.allWords = this.flattenWords();
  }

  /**
   * Aplana todas las palabras en un array para búsqueda rápida
   */
  flattenWords() {
    const flattened = [];
    
    Object.values(colombianWords).forEach(category => {
      Object.values(category).forEach(wordData => {
        wordData.keywords.forEach(keyword => {
          flattened.push({
            keyword: keyword.toLowerCase(),
            wordData: wordData,
            originalKey: Object.keys(category).find(key => category[key] === wordData)
          });
        });
      });
    });
    
    return flattened;
  }

  /**
   * Busca palabras colombianas en el texto del usuario
   * @param {string} userText - Texto del usuario
   * @returns {Array} Array de palabras encontradas con sus datos
   */
  findMatches(userText) {
    if (!userText || typeof userText !== 'string') {
      return [];
    }

    const userTextLower = userText.toLowerCase();
    const matches = [];

    this.allWords.forEach(word => {
      if (userTextLower.includes(word.keyword)) {
        matches.push({
          keyword: word.keyword,
          wordData: word.wordData,
          originalKey: word.originalKey,
          position: userTextLower.indexOf(word.keyword)
        });
      }
    });

    // Ordenar por posición en el texto (primero las que aparecen antes)
    return matches.sort((a, b) => a.position - b.position);
  }

  /**
   * Obtiene la mejor respuesta para una palabra específica
   * @param {string} wordKey - Clave de la palabra
   * @returns {string|null} Respuesta aleatoria o null si no se encuentra
   */
  getResponse(wordKey) {
    // Buscar en todas las categorías
    for (const category of Object.values(colombianWords)) {
      if (category[wordKey]) {
        const responses = category[wordKey].responses;
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
      }
    }
    return null;
  }

  /**
   * Obtiene información de una palabra específica
   * @param {string} wordKey - Clave de la palabra
   * @returns {Object|null} Datos de la palabra o null si no se encuentra
   */
  getWordInfo(wordKey) {
    for (const category of Object.values(colombianWords)) {
      if (category[wordKey]) {
        return category[wordKey];
      }
    }
    return null;
  }

  /**
   * Obtiene todas las palabras de una categoría específica
   * @param {string} category - Nombre de la categoría
   * @returns {Array} Array de palabras de esa categoría
   */
  getWordsByCategory(category) {
    if (colombianWords[category]) {
      return Object.keys(colombianWords[category]);
    }
    return [];
  }

  /**
   * Obtiene todas las categorías disponibles
   * @returns {Array} Array de nombres de categorías
   */
  getCategories() {
    return Object.keys(colombianWords);
  }

  /**
   * Busca palabras que contengan un patrón específico
   * @param {string} pattern - Patrón a buscar
   * @returns {Array} Array de palabras que coinciden con el patrón
   */
  searchByPattern(pattern) {
    if (!pattern || typeof pattern !== 'string') {
      return [];
    }

    const patternLower = pattern.toLowerCase();
    const matches = [];

    this.allWords.forEach(word => {
      if (word.keyword.includes(patternLower) || patternLower.includes(word.keyword)) {
        matches.push({
          keyword: word.keyword,
          wordData: word.wordData,
          originalKey: word.originalKey
        });
      }
    });

    return matches;
  }
}

module.exports = WordMatcher;
