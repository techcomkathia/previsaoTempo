const apiGeocoding = "https://geocoding-api.open-meteo.com/v1/search?name="
const apiWeather = "https://api.open-meteo.com/v1/forecast?latitude="

const DEBUG = false; // Altere para true para ver logs em desenvolvimento

/**
 * Objeto contendo referências aos elementos do DOM
 * @type {Object}
 * @property {HTMLElement} cidade - Elemento do título da cidade
 * @property {HTMLElement} temperatura - Elemento de exibição da temperatura
 * @property {HTMLElement} umidade - Elemento de exibição da umidade
 * @property {HTMLElement} descricao - Elemento de descrição do tempo
 * @property {HTMLElement} icone - Elemento do ícone do tempo
 * @property {HTMLElement} inputCidade - Campo de entrada para busca
 * @property {HTMLElement} corpo - Elemento body
 */
const elementos = {
    cidade: document.querySelector("#cidade"),
    temperatura: document.querySelector("#temp"),
    umidade: document.querySelector("#umidade"),
    descricao: document.querySelector("#descricao"),
    icone: document.querySelector("#icone"),
    inputCidade: document.querySelector("#inputCidade"),
    corpo: document.body
};

/**
 * Mensagens amigáveis de erro para o usuário
 */
const mensagensErro = {
    cityNotFound: "Cidade não encontrada. Tente novamente com outro nome.",
    networkError: "Não foi possível conectar ao serviço. Verifique sua conexão.",
    apiError: "Estamos com dificuldades para carregar os dados. Tente novamente em alguns instantes.",
    invalidData: "Dados recebidos são inválidos. Tente novamente.",
    emptyInput: "Digite o nome de uma cidade para buscar."
};

/**
 * Registra logs apenas em modo debug
 * @param {string} titulo - Título do log
 * @param {*} dados - Dados a registrar
 */
function logDebug(titulo, dados) {
    if (DEBUG) {
        console.log(`[${titulo}]`, dados);
    }
}

/**
 * Tratamento centralizado de erros de requisição
 * @param {Error} erro - Objeto de erro
 * @returns {string} Mensagem amigável ao usuário
 */
function tratarErro(erro) {
    logDebug("ERRO", erro);

    if (erro.message.includes("Cidade não encontrada")) {
        return mensagensErro.cityNotFound;
    }
    
    if (erro instanceof TypeError) {
        return mensagensErro.networkError;
    }

    if (erro.message.includes("requisição") || erro.message.includes("API")) {
        return mensagensErro.apiError;
    }

    if (erro.message.includes("Dados inválidos") || erro.message.includes("não disponível")) {
        return mensagensErro.invalidData;
    }

    return mensagensErro.apiError;
}

/**
 * Limpa todos os campos de exibição
 */
function limparCampos() {
    elementos.temperatura.innerHTML = "";
    elementos.umidade.innerHTML = "";
    elementos.descricao.innerHTML = "";
    elementos.icone.textContent = "";
}

/**
 * Exibe uma notificação (toast) na tela
 * @param {string} mensagem - Mensagem a exibir
 * @param {number} duracao - Duração em milissegundos (padrão: 3000ms)
 */
function mostrarNotificacao(mensagem, duracao = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duracao);
}

/**
 * Busca as coordenadas de uma cidade através da API de geocoding
 * @async
 * @param {string} local - Nome da cidade a buscar
 * @returns {Promise<Object>} Objeto contendo latitude, longitude, nome e país
 * @throws {Error} Se a cidade não for encontrada ou houver erro na requisição
 */
async function buscarCoordenadas(local){
    try {
        let resposta = await fetch(apiGeocoding + local + "&count=1&language=pt&format=json")
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar coordenadas");
        }
        
        let resultado = await resposta.json()
        
        if (!resultado.results || resultado.results.length === 0) {
            throw new Error("Cidade não encontrada");
        }
        
        const cidade = resultado.results[0];
        return { 
            lat: cidade.latitude, 
            lon: cidade.longitude, 
            nome: cidade.name
        };
    } catch (erro) {
        throw erro;
    }
}

/**
 * Busca os dados de tempo de uma cidade
 * @async
 * @param {string} local - Nome da cidade a buscar
 * @returns {Promise<void>} Atualiza o DOM com os dados ou exibe erro
 */
async function buscarCidade(local){
    try {
        const coordenadas = await buscarCoordenadas(local);
        logDebug("Coordenadas encontradas", coordenadas);
        
        let resposta = await fetch(apiWeather + coordenadas.lat + "&longitude=" + coordenadas.lon + "&current=temperature_2m,weather_code,relative_humidity_2m&temperature_unit=celsius&language=pt")
        
        if (!resposta.ok) {
            throw new Error("Erro na API de clima");
        }
        
        let dados = await resposta.json()
        exibirNaTela(dados, coordenadas.nome)
    } catch (erro) {
        const mensagem = tratarErro(erro);
        elementos.cidade.innerHTML = mensagem;
        limparCampos();
    }
}


/**
 * Obtém informações de descrição, ícone e imagem de fundo baseado no código de tempo
 * @param {number} codigoTempo - Código WMO do tipo de tempo
 * @returns {Object} Objeto com descrição, ícone e imagem do tempo
 */
function obterTempoInfo(codigoTempo) {
    const temposInfo = {
        0: { descricao: "Céu limpo", icone: "☀️", imagem: "images/0.jpg" },
        1: { descricao: "Principalmente claro", icone: "🌤️", imagem: "images/1.jpg" },
        2: { descricao: "Parcialmente nublado", icone: "⛅", imagem: "images/2.jpg" },
        3: { descricao: "Nublado", icone: "☁️", imagem: "images/3.jpg" },
        45: { descricao: "Nevoeiro", icone: "🌫️", imagem: "images/45.jpg" },
        48: { descricao: "Nevoeiro com depósito de gelo", icone: "🌫️", imagem: "images/48.jpg" },
        51: { descricao: "Chuvisco leve", icone: "🌧️", imagem: "images/51.jpg" },
        53: { descricao: "Chuvisco moderado", icone: "🌧️", imagem: "images/52.jpg" },
        55: { descricao: "Chuvisco denso", icone: "🌧️", imagem: "images/55.jpg" },
        61: { descricao: "Chuva fraca", icone: "🌧️", imagem: "images/61.jpg" },
        63: { descricao: "Chuva moderada", icone: "🌧️", imagem: "images/63.jpg" },
        65: { descricao: "Chuva forte", icone: "⛈️", imagem: "images/65.jpg" },
        71: { descricao: "Neve fraca", icone: "🌨️", imagem: "images/71.jpg" },
        73: { descricao: "Neve moderada", icone: "🌨️", imagem: "images/73.jpg" },
        75: { descricao: "Neve forte", icone: "🌨️", imagem: "images/75.jpg" },
        77: { descricao: "Grãos de neve", icone: "🌨️", imagem: "images/77.jpg" },
        80: { descricao: "Pancadas de chuva fracas", icone: "🌧️", imagem: "images/80.jpg" },
        81: { descricao: "Pancadas de chuva moderadas", icone: "🌧️", imagem: "images/81.jpg" },
        82: { descricao: "Pancadas de chuva fortes", icone: "⛈️", imagem: "images/65.jpg" },
        85: { descricao: "Pancadas de neve fracas", icone: "🌨️", imagem: "images/71.jpg" },
        86: { descricao: "Pancadas de neve fortes", icone: "🌨️", imagem: "images/86.jpg" },
        95: { descricao: "Trovoada", icone: "⛈️", imagem: "images/95.jpg" },
        96: { descricao: "Trovoada com granizo fraco", icone: "⛈️", imagem: "images/96.jpg" },
        99: { descricao: "Trovoada com granizo forte", icone: "⛈️", imagem: "images/99.jpg" }
    };
    return temposInfo[codigoTempo] || { descricao: "Tempo desconhecido", icone: "🌤️", imagem: "images/2.jpg" };
}

/**
 * Exibe os dados de tempo no DOM
 * @param {Object} dados - Objeto contendo dados meteorológicos da API
 * @param {string} nomeCidade - Nome da cidade para exibição
 * @returns {void}
 */
function exibirNaTela(dados, nomeCidade) {
    try {
        if (!dados || !dados.current) {
            throw new Error("Dados inválidos recebidos da API");
        }
        
        const dadosAtuais = dados.current;
        
        if (dadosAtuais.temperature_2m === undefined) {
            throw new Error("Temperatura não disponível");
        }

        const temp = Math.round(dadosAtuais.temperature_2m);
        const umid = dadosAtuais.relative_humidity_2m || 0;
        const codTempo = dadosAtuais.weather_code;
        const tempoInfo = obterTempoInfo(codTempo);
        
        elementos.cidade.innerHTML = "Tempo em " + nomeCidade;
        elementos.temperatura.innerHTML = temp + "°C";
        elementos.umidade.innerHTML = "Umidade: " + umid + "%"
        elementos.descricao.innerHTML = tempoInfo.descricao;
        elementos.icone.textContent = tempoInfo.icone;
        elementos.icone.style.fontSize = "60px";
        
        elementos.corpo.style.backgroundImage = `url("${tempoInfo.imagem}")`;

    } catch (erro) {
        const mensagem = tratarErro(erro);
        elementos.cidade.innerHTML = mensagem;
        limparCampos();
    }
}

/**
 * Busca uma cidade quando o usuário clica no botão de pesquisa
 * @returns {void}
 */
function pesquisar() {
    const entrada = elementos.inputCidade.value.trim();
    
    if (!entrada) {
        mostrarNotificacao(mensagensErro.emptyInput, 3000);
        return;
    }
    
    buscarCidade(entrada);
}

// Carrega informações de Fortaleza ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    buscarCidade('fortaleza');
});