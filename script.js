const apiUnsplash = "https://picsum.photos/seed/"
const apiGeocoding = "https://geocoding-api.open-meteo.com/v1/search?name="
const apiWeather = "https://api.open-meteo.com/v1/forecast?latitude="

// Elementos do DOM
const elementos = {
    cidade: document.querySelector("#cidade"),
    temperatura: document.querySelector("#temp"),
    umidade: document.querySelector("#umidade"),
    descricao: document.querySelector("#descricao"),
    icone: document.querySelector("#icone"),
    inputCidade: document.querySelector("#inputCidade"),
    corpo: document.body
};

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
            nome: cidade.name,
            pais: cidade.country 
        };
    } catch (error) {
        console.log("Erro ao buscar coordenadas: ", error);
        throw error;
    }
}

async function buscarCidade(local){
    try {
        const coordenadas = await buscarCoordenadas(local);
        
        let resposta = await fetch(apiWeather + coordenadas.lat + "&longitude=" + coordenadas.lon + "&current=temperature_2m,weather_code,relative_humidity_2m&temperature_unit=celsius&language=pt")
        
        if (!resposta.ok) {
            throw new Error("Erro na requisição da API");
        }
        
        let dados = await resposta.json()
        console.log("Resposta da API:", dados);
        
        exibirNaTela(dados, coordenadas.nome)
    } catch (error) {
        console.log("Erro ao buscar cidade: ", error);
        elementos.cidade.innerHTML = error.message || "Erro ao buscar a cidade";
        elementos.temperatura.innerHTML = "";
        elementos.umidade.innerHTML = "";
        elementos.descricao.innerHTML = "";
        elementos.icone.textContent = "";
    }
}


function obterTempoInfo(codigoTempo) {
    const temposInfo = {
        0: { descricao: "Céu limpo", icone: "☀️" },
        1: { descricao: "Principalmente claro", icone: "🌤️" },
        2: { descricao: "Parcialmente nublado", icone: "⛅" },
        3: { descricao: "Nublado", icone: "☁️" },
        45: { descricao: "Nevoeiro", icone: "🌫️" },
        48: { descricao: "Nevoeiro com depósito de gelo", icone: "🌫️" },
        51: { descricao: "Chuvisco leve", icone: "🌧️" },
        53: { descricao: "Chuvisco moderado", icone: "🌧️" },
        55: { descricao: "Chuvisco denso", icone: "🌧️" },
        61: { descricao: "Chuva fraca", icone: "🌧️" },
        63: { descricao: "Chuva moderada", icone: "🌧️" },
        65: { descricao: "Chuva forte", icone: "⛈️" },
        71: { descricao: "Neve fraca", icone: "🌨️" },
        73: { descricao: "Neve moderada", icone: "🌨️" },
        75: { descricao: "Neve forte", icone: "🌨️" },
        77: { descricao: "Grãos de neve", icone: "🌨️" },
        80: { descricao: "Pancadas de chuva fracas", icone: "🌧️" },
        81: { descricao: "Pancadas de chuva moderadas", icone: "🌧️" },
        82: { descricao: "Pancadas de chuva fortes", icone: "⛈️" },
        85: { descricao: "Pancadas de neve fracas", icone: "🌨️" },
        86: { descricao: "Pancadas de neve fortes", icone: "🌨️" },
        95: { descricao: "Trovoada", icone: "⛈️" },
        96: { descricao: "Trovoada com granizo fraco", icone: "⛈️" },
        99: { descricao: "Trovoada com granizo forte", icone: "⛈️" }
    };
    return temposInfo[codigoTempo] || { descricao: "Tempo desconhecido", icone: "🌤️" };
}

function exibirNaTela(dados, nomeCidade) {
    console.log("Dados recebidos:", dados)

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

        console.log("Exibindo dados para:", nomeCidade);
        elementos.cidade.innerHTML = "Tempo em " + nomeCidade;
        elementos.temperatura.innerHTML = temp + "°C";
        elementos.umidade.innerHTML = "Umidade: " + umid + "%"
        elementos.descricao.innerHTML = tempoInfo.descricao;
        elementos.icone.textContent = tempoInfo.icone;
        elementos.icone.style.fontSize = "60px";
        
        // Gera um número baseado no nome da cidade para manter consistência
        const numeroImagem = nomeCidade.charCodeAt(0) + nomeCidade.length;
        elementos.corpo.style.backgroundImage = `url("${apiUnsplash}${numeroImagem}/1600/900")`;

    } catch (error) {
        console.log("Erro ao exibir dados:", error.message);
        elementos.cidade.innerHTML = error.message;
        elementos.temperatura.innerHTML = "";
        elementos.umidade.innerHTML = "";
        elementos.descricao.innerHTML = "";
        elementos.icone.textContent = "";
    }
}

function pesquisar() {
    if (elementos.inputCidade.value) {
        buscarCidade(elementos.inputCidade.value);
    } else {
        alert("Por favor, digite o nome de uma cidade.");
    }
}

// Carrega informações de Fortaleza ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    buscarCidade('fortaleza');
});