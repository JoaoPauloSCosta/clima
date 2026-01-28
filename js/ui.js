// ui.js - Responsável por renderizar dados na tela

/**
 * URL da bandeira do país (FlagCDN). Usar apenas para códigos ISO 3166-1 alpha-2.
 * @param {string} code - Código do país (ex.: BR, US)
 * @returns {string} URL da imagem
 */
function getCountryFlagUrl(code) {
    if (!code || code.length !== 2) return '';
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
}

/**
 * Monta o conteúdo do título da cidade (nome + bandeira se fora do Brasil).
 * @param {HTMLElement} el - Elemento que recebe o conteúdo
 * @param {string} name - Nome da cidade
 * @param {string} country - Código do país (ex.: BR, US)
 */
function renderCityName(el, name, country) {
    el.innerHTML = '';
    const wrap = document.createElement('span');
    wrap.className = 'inline-flex items-center gap-2';

    const isBrazil = country && country.toUpperCase() === 'BR';
    if (!isBrazil && country) {
        const img = document.createElement('img');
        img.src = getCountryFlagUrl(country);
        img.alt = '';
        img.width = 32;
        img.height = 24;
        img.className = 'rounded-sm object-cover h-5 w-7 flex-shrink-0';
        img.loading = 'lazy';
        img.decoding = 'async';
        wrap.appendChild(img);
    }

    const label = country ? `${name}, ${country}` : name;
    wrap.appendChild(document.createTextNode(label));
    el.appendChild(wrap);
}

/**
 * Renderiza os dados do clima na tela
 * @param {Object} weatherData - Dados do clima
 */
function renderWeather(weatherData) {
    // Mostrar área de clima
    const weatherArea = document.getElementById('weatherArea');
    weatherArea.classList.remove('hidden');

    // Preencher dados atuais
    const cityNameEl = document.getElementById('cityName');
    renderCityName(cityNameEl, weatherData.city.name, weatherData.city.country);

    const currentTempEl = document.getElementById('currentTemp');
    currentTempEl.textContent = `${weatherData.current.temperature}°C`;

    const weatherDescEl = document.getElementById('weatherDescription');
    weatherDescEl.textContent = weatherData.current.description;

    const feelsLikeEl = document.getElementById('feelsLike');
    feelsLikeEl.textContent = `Sensação térmica: ${weatherData.current.feelsLike}°C`;

    // Renderizar previsão
    renderForecast(weatherData.forecast);
}

/**
 * Renderiza a previsão dos próximos 7 dias
 * @param {Array} forecast - Array com dados da previsão
 */
function renderForecast(forecast) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';

    if (!forecast || forecast.length === 0) {
        container.innerHTML = '<p class="text-slate-500 col-span-full text-center text-sm py-6">Nenhuma previsão disponível.</p>';
        return;
    }

    forecast.forEach((day, i) => {
        const card = createForecastCard(day, i);
        container.appendChild(card);
    });
}

/**
 * Cria um card de previsão para um dia
 * @param {Object} day - Dados do dia
 * @param {number} [index=0] - Índice para animação escalonada
 * @returns {HTMLElement} Elemento do card
 */
function createForecastCard(day, index = 0) {
    const delayMs = 50 * (Math.min(index, 6) + 1);
    const card = document.createElement('div');
    card.className = 'flex flex-col p-4 bg-slate-900/80 border border-slate-700 rounded-sharp text-slate-200 hover:border-slate-600 hover:scale-[1.02] transition-transform duration-200 opacity-0 animate-fade-in-up';
    card.style.animationDelay = `${delayMs}ms`;

    const dayName = document.createElement('div');
    dayName.className = 'text-sm font-semibold text-white mb-1';
    dayName.textContent = day.day;

    const date = document.createElement('div');
    date.className = 'text-xs text-slate-500 mb-3';
    date.textContent = day.date;

    const icon = document.createElement('img');
    icon.className = 'w-12 h-12 mx-auto mb-2';
    icon.src = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
    icon.alt = day.description;

    const description = document.createElement('div');
    description.className = 'text-xs text-slate-400 text-center mb-2 capitalize line-clamp-2';
    description.textContent = day.description;

    const temp = document.createElement('div');
    temp.className = 'text-xl font-bold text-brand-400 text-center mb-1 tabular-nums';
    temp.textContent = `${day.temperature}°C`;

    const tempRange = document.createElement('div');
    tempRange.className = 'text-xs text-slate-500 text-center';
    tempRange.textContent = `Máx ${day.maxTemp}° · Mín ${day.minTemp}°`;

    card.appendChild(dayName);
    card.appendChild(date);
    card.appendChild(icon);
    card.appendChild(description);
    card.appendChild(temp);
    card.appendChild(tempRange);

    return card;
}

/**
 * Renderiza mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function renderError(message) {
    const errorArea = document.getElementById('errorArea');
    const errorMessage = document.getElementById('errorMessage');
    
    errorArea.classList.remove('hidden');
    errorMessage.textContent = message;

    // Esconder área de clima
    const weatherArea = document.getElementById('weatherArea');
    weatherArea.classList.add('hidden');
}

/**
 * Esconde a mensagem de erro
 */
function hideError() {
    const errorArea = document.getElementById('errorArea');
    errorArea.classList.add('hidden');
}

/**
 * Mostra o loading
 */
function showLoading() {
    const loadingArea = document.getElementById('loadingArea');
    loadingArea.classList.remove('hidden');

    // Esconder outras áreas
    const weatherArea = document.getElementById('weatherArea');
    weatherArea.classList.add('hidden');
    hideError();
}

/**
 * Esconde o loading
 */
function hideLoading() {
    const loadingArea = document.getElementById('loadingArea');
    loadingArea.classList.add('hidden');
}

/**
 * Renderiza o histórico de cidades
 * @param {Array<string>} cities - Lista de cidades
 */
function renderHistory(cities) {
    const historyList = document.getElementById('historyList');
    
    if (!cities || cities.length === 0) {
        historyList.innerHTML = '<p class="text-slate-500 text-center text-sm">Nenhuma cidade pesquisada ainda.</p>';
        return;
    }

    historyList.innerHTML = '';

    const list = document.createElement('ul');
    list.className = 'space-y-1.5';

    cities.forEach(city => {
        const listItem = createHistoryItem(city);
        list.appendChild(listItem);
    });

    historyList.appendChild(list);
}

/**
 * Cria um item do histórico
 * @param {string} cityName - Nome da cidade
 * @returns {HTMLElement} Elemento do item
 */
function createHistoryItem(cityName) {
    const item = document.createElement('li');
    item.className = 'flex items-center justify-between px-3 py-2.5 bg-slate-800/60 border border-slate-700 rounded-sharp hover:border-slate-600 hover:bg-slate-800/80 transition-colors cursor-pointer';

    const cityNameEl = document.createElement('span');
    cityNameEl.className = 'text-slate-200 font-medium text-sm';
    cityNameEl.textContent = cityName;

    const button = document.createElement('button');
    button.className = 'text-slate-400 hover:text-red-400 text-xs font-medium focus-ring rounded px-1.5 py-0.5';
    button.textContent = 'Remover';
    button.setAttribute('data-city', cityName);
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCity(cityName);
        const updatedCities = getCities();
        renderHistory(updatedCities);
    });

    item.appendChild(cityNameEl);
    item.appendChild(button);

    // Adicionar evento de clique para buscar a cidade
    item.addEventListener('click', (e) => {
        if (e.target !== button && !button.contains(e.target)) {
            // Disparar evento customizado para buscar a cidade
            const searchEvent = new CustomEvent('searchCity', { detail: { cityName } });
            document.dispatchEvent(searchEvent);
        }
    });

    return item;
}
