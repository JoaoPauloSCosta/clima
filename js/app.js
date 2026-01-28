// app.js - Controle principal da aplicação

/**
 * Inicializa a aplicação
 */
function init() {
    // Carregar histórico
    const cities = getCities();
    renderHistory(cities);

    // Configurar formulário de busca
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', handleSearch);

    // Configurar input para permitir busca com Enter
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e);
        }
    });

    // Escutar evento customizado de busca pelo histórico
    document.addEventListener('searchCity', (e) => {
        searchCity(e.detail.cityName);
    });
}

/**
 * Manipula o evento de busca
 * @param {Event} event - Evento do formulário
 */
async function handleSearch(event) {
    event.preventDefault();

    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();

    // Validar input
    if (!cityName) {
        renderError('Por favor, digite o nome de uma cidade.');
        return;
    }

    // Mostrar loading
    showLoading();

    try {
        // Buscar dados do clima
        const weatherData = await fetchWeather(cityName);

        // Esconder loading
        hideLoading();

        // Renderizar dados
        renderWeather(weatherData);

        // Salvar no histórico
        saveCity(cityName);

        // Atualizar histórico na tela
        const cities = getCities();
        renderHistory(cities);

        // Limpar input
        cityInput.value = '';
    } catch (error) {
        // Esconder loading
        hideLoading();

        // Mostrar erro
        renderError(error.message);
    }
}

/**
 * Busca o clima de uma cidade (usado pelo histórico)
 * @param {string} cityName - Nome da cidade
 */
async function searchCity(cityName) {
    const cityInput = document.getElementById('cityInput');
    cityInput.value = cityName;

    // Mostrar loading
    showLoading();

    try {
        // Buscar dados do clima
        const weatherData = await fetchWeather(cityName);

        // Esconder loading
        hideLoading();

        // Renderizar dados
        renderWeather(weatherData);

        // Salvar no histórico (atualizar posição)
        saveCity(cityName);

        // Atualizar histórico na tela
        const cities = getCities();
        renderHistory(cities);
    } catch (error) {
        // Esconder loading
        hideLoading();

        // Mostrar erro
        renderError(error.message);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
