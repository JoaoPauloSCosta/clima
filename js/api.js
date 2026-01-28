// api.js - Chamadas à API de clima (backend próprio; chave nunca vai para o frontend)

const API_BASE = '/api';

/**
 * Busca dados do clima de uma cidade
 * @param {string} cityName - Nome da cidade
 * @returns {Promise<Object>} Dados do clima atual e previsão
 */
async function fetchWeather(cityName) {
    const trimmed = (cityName || '').trim();
    if (!trimmed) {
        throw new Error('Por favor, digite o nome de uma cidade.');
    }

    const url = `${API_BASE}/weather?city=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);

    if (!res.ok) {
        let msg = 'Erro ao buscar dados do clima. Tente novamente mais tarde.';
        try {
            const data = await res.json();
            if (data.error && typeof data.error === 'string') msg = data.error;
        } catch (_) {}
        throw new Error(msg);
    }

    return res.json();
}
