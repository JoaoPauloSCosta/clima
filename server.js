/**
 * Servidor que expõe a API de clima e serve os arquivos estáticos.
 * A chave da OpenWeather fica apenas em variável de ambiente (nunca no frontend).
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error('Erro: defina OPENWEATHER_API_KEY no arquivo .env');
    process.exit(1);
}

app.use(express.static(path.join(__dirname)));

app.get('/api/weather', async (req, res) => {
    const city = (req.query.city || '').trim();
    if (!city) {
        return res.status(400).json({ error: 'Parâmetro "city" é obrigatório.' });
    }

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(
                `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`
            ),
            fetch(
                `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br&cnt=40`
            )
        ]);

        if (!currentRes.ok) {
            if (currentRes.status === 404) {
                return res.status(404).json({ error: 'Cidade não encontrada. Verifique o nome e tente novamente.' });
            }
            return res.status(502).json({ error: 'Erro ao buscar dados do clima. Tente novamente mais tarde.' });
        }

        if (!forecastRes.ok) {
            return res.status(502).json({ error: 'Erro ao buscar previsão do tempo.' });
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        const weatherData = {
            city: {
                name: currentData.name,
                country: currentData.sys.country
            },
            current: {
                temperature: Math.round(currentData.main.temp),
                feelsLike: Math.round(currentData.main.feels_like),
                description: currentData.weather[0].description,
                icon: currentData.weather[0].icon,
                humidity: currentData.main.humidity,
                windSpeed: currentData.wind.speed
            },
            forecast: processForecastData(forecastData.list)
        };

        res.json(weatherData);
    } catch (err) {
        console.error('Erro ao buscar clima:', err.message);
        res.status(502).json({ error: 'Erro ao buscar dados do clima. Tente novamente mais tarde.' });
    }
});

function processForecastData(forecastList) {
    const daysMap = new Map();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const item of forecastList) {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        const dayIndex = Math.floor((date - today) / (1000 * 60 * 60 * 24));

        if (dayIndex >= 1 && dayIndex <= 7) {
            if (!daysMap.has(dayKey)) {
                daysMap.set(dayKey, {
                    date,
                    dayIndex,
                    temps: [],
                    descriptions: [],
                    icons: []
                });
            }
            const d = daysMap.get(dayKey);
            d.temps.push(Math.round(item.main.temp));
            d.descriptions.push(item.weather[0].description);
            d.icons.push(item.weather[0].icon);
        }
    }

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return Array.from(daysMap.values())
        .sort((a, b) => a.dayIndex - b.dayIndex)
        .slice(0, 7)
        .map((dayData) => {
            const avgTemp = Math.round(
                dayData.temps.reduce((s, t) => s + t, 0) / dayData.temps.length
            );
            const minTemp = Math.min(...dayData.temps);
            const maxTemp = Math.max(...dayData.temps);
            const desc = getMostCommon(dayData.descriptions);
            const icon = getMostCommon(dayData.icons);
            const d = dayData.date;
            return {
                day: days[d.getDay()],
                date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
                temperature: avgTemp,
                minTemp,
                maxTemp,
                description: desc,
                icon
            };
        });
}

function getMostCommon(arr) {
    const freq = {};
    let max = 0;
    let out = arr[0];
    for (const x of arr) {
        freq[x] = (freq[x] || 0) + 1;
        if (freq[x] > max) {
            max = freq[x];
            out = x;
        }
    }
    return out;
}

app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});
