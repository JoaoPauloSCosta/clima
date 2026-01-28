# 🌦️ App de Clima - Previsão do Tempo

Aplicação web para consultar a previsão do tempo de qualquer cidade, exibindo informações detalhadas para os próximos 7 dias.

## 📋 Descrição

Este projeto é um aplicativo web desenvolvido com HTML5, Tailwind CSS e JavaScript puro, que permite aos usuários buscar informações climáticas de qualquer cidade do mundo. O sistema exibe a temperatura atual, condições climáticas e uma previsão detalhada para os próximos 7 dias.

## 🚀 Funcionalidades

- ✅ Busca de clima por cidade
- ✅ Previsão do tempo para os próximos 7 dias
- ✅ Exibição de temperatura atual e sensação térmica
- ✅ Loading durante a busca de dados
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ Histórico de cidades pesquisadas (salvo no localStorage)
- ✅ Interface responsiva e moderna
- ✅ Suporte a modo escuro (dark mode)

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **Tailwind CSS** - Estilização e design responsivo
- **JavaScript (ES6+)** - Lógica da aplicação
- **Node.js + Express** - Servidor (API de clima + arquivos estáticos)
- **OpenWeatherMap API** - Dados climáticos (chave só no servidor)

## 📦 Estrutura do Projeto

```
weather-app/
├── js/
│   ├── app.js      # Controle principal da aplicação
│   ├── api.js      # Chamadas ao backend (/api/weather)
│   ├── ui.js       # Renderização na tela
│   └── storage.js  # Gerenciamento do localStorage
├── server.js       # Servidor Express (API + estáticos); chave da API só aqui
├── vercel.json     # Headers (CSP) para deploy na Vercel
├── .env.example    # Exemplo de variáveis (copie para .env)
├── index.html      # Página principal
└── README.md       # Documentação
```

## 🔧 Configuração

### 1. Obter chave da API

1. Acesse [OpenWeatherMap](https://openweathermap.org/api)
2. Crie uma conta gratuita
3. Obtenha sua API Key

### 2. Configurar variáveis de ambiente

A chave **nunca** fica no frontend; ela fica apenas no servidor, em variável de ambiente:

```bash
# Copie o exemplo e edite
cp .env.example .env
```

Edite o `.env` e defina sua chave:

```
OPENWEATHER_API_KEY=sua-chave-aqui
PORT=3000
```

### 3. Executar o projeto

O app precisa rodar pelo servidor Node (que serve a API e os arquivos estáticos). Requer **Node 18+**:

```bash
npm install
npm start
```

Acesse `http://localhost:3000` no navegador.

### 4. Deploy na Vercel

O `vercel.json` já define **Content-Security-Policy** para permitir Tailwind CDN, scripts e estilos inline. Se ainda aparecerem erros de CSP no console:

- Em **Project Settings → Security Headers** (ou similar), desative ou ajuste o preset que usa `default-src 'none'`, pois ele bloqueia fontes, Tailwind e scripts inline.
- Os erros de `prepare.js` e "listener indicated an asynchronous response" costumam vir de **extensões do navegador** (ex.: React DevTools, Grammarly). Para testar, use aba anônima ou desative extensões.

Na Vercel, use **Serverless Functions** para `/api/weather` (ex.: `api/weather.js`) e configure `OPENWEATHER_API_KEY` nas variáveis de ambiente do projeto.

## 📱 Como Usar

1. Digite o nome de uma cidade no campo de busca
2. Clique em "Buscar" ou pressione Enter
3. Visualize a temperatura atual e a previsão para os próximos 7 dias
4. Acesse cidades pesquisadas anteriormente através do histórico
5. Clique em "Remover" para excluir uma cidade do histórico

## 🎨 Características da Interface

- Design moderno com gradientes
- Cards informativos para cada dia da previsão
- Animações suaves e transições
- Layout totalmente responsivo
- Suporte a modo escuro

## 📊 Dados Exibidos

### Informações Atuais
- Nome da cidade e país
- Temperatura atual
- Sensação térmica
- Descrição do clima
- Ícone representativo

### Previsão de 7 Dias
- Dia da semana e data
- Temperatura média
- Temperatura máxima e mínima
- Descrição do clima
- Ícone representativo

## 🔒 Armazenamento Local

O histórico de cidades é salvo no `localStorage` do navegador, permitindo:
- Acesso rápido a cidades pesquisadas anteriormente
- Persistência dos dados entre sessões
- Limite de 10 cidades no histórico

## ⚠️ Tratamento de Erros

O sistema trata os seguintes casos:
- Cidade não encontrada
- Erro na conexão com a API
- Input vazio
- Erros de rede

## 🌐 API Utilizada

**OpenWeatherMap API** (chamada apenas pelo servidor; a chave não é enviada ao navegador)
- Endpoint atual: `/weather`
- Endpoint previsão: `/forecast`
- Documentação: https://openweathermap.org/api

## 📝 Licença

Este projeto é de código aberto e está disponível para uso educacional.

## 👨‍💻 Desenvolvimento

Desenvolvido seguindo as melhores práticas de:
- Código limpo e organizado
- Separação de responsabilidades
- Funções pequenas e específicas
- Tratamento adequado de erros
- Validação de dados

---

**Versão:** 1.0  
**Última atualização:** Janeiro 2026
