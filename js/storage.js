// storage.js - Responsável por gerenciar o histórico de cidades no localStorage

const STORAGE_KEY = 'weatherApp_cities';

/**
 * Salva uma cidade no histórico
 * @param {string} cityName - Nome da cidade
 */
function saveCity(cityName) {
    if (!cityName || cityName.trim() === '') {
        return;
    }

    const cities = getCities();
    const normalizedCity = cityName.trim();

    // Remover se já existir (para mover para o topo)
    const filteredCities = cities.filter(city => city.toLowerCase() !== normalizedCity.toLowerCase());
    
    // Adicionar no início
    filteredCities.unshift(normalizedCity);

    // Limitar a 10 cidades
    const limitedCities = filteredCities.slice(0, 10);

    // Salvar no localStorage
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedCities));
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
}

/**
 * Retorna a lista de cidades salvas
 * @returns {Array<string>} Array com nomes das cidades
 */
function getCities() {
    try {
        const citiesJson = localStorage.getItem(STORAGE_KEY);
        if (!citiesJson) {
            return [];
        }
        return JSON.parse(citiesJson);
    } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return [];
    }
}

/**
 * Remove uma cidade do histórico
 * @param {string} cityName - Nome da cidade a remover
 */
function removeCity(cityName) {
    const cities = getCities();
    const filteredCities = cities.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCities));
    } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
    }
}

/**
 * Limpa todo o histórico
 */
function clearHistory() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
    }
}
