const chave = "cebcd482eda57fa9a6714c1c2ba91885"
const apiUnsplash = "https://source.unsplash.com/1600x900/?"
const apiWeather = "https://api.openweathermap.org/data/2.5/weather?q="

function exibirNaTela(dados){
    console.log(dados)
    const cidade = document.querySelector("#cidade")
    const temperatura = document.querySelector("#temp")
    const descricao = document.querySelector("#descricao")

    const icone = document.querySelector("#icone")

    cidade.innerHTML = "Tempo em " + dados.name
    temperatura.innerHTML =  parseInt(dados.main.temp) + " °C"
    descricao.innerHTML = dados.weather[0].description
    icone.src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png"

    //mudar a tela de backgroun
    document.body.style.backgroundImage = `url("${apiUnsplash + dados.name}")`;

}

async function buscarCidade(local){
    let dados = await fetch(apiWeather +  local + "&appid=" +  chave + "&lang=pt_br" + "&units=metric"
    )
    .then(resposta => resposta.json())

    exibirNaTela(dados)
}


function exibirNaTela(dados) {
    console.log(dados)
    
    const cidade = document.querySelector("#cidade")
    const temperatura = document.querySelector("#temp")
    const umidade = document.querySelector("#umidade")
    const descricao = document.querySelector("#descricao")
    const icone = document.querySelector("#icone")

    try {
        if (dados.cod === "404") {
            throw new Error("Cidade não encontrada");
        }
        
        console.log(dados);
        cidade.innerHTML = "Tempo em " + dados.name;
        temperatura.innerHTML = parseInt(dados.main.temp) + "°C";
        umidade.innerHTML= "Umidade: " + parseInt(dados.main.humidity) + "%"
        descricao.innerHTML = dados.weather[0].description;
        icone.src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png";
				 //mudar a tela de backgroun
		    document.body.style.backgroundImage = `url("${apiUnsplash + dados.name}")`;

    } catch (error) {
        console.log(error.message);
        cidade.innerHTML = error.message;
        temperatura.innerHTML = "";
        umidade.innerHTML = "";
        descricao.innerHTML = "";
        icone.src = "";
    }
}

function pesquisar() {
    const inputCidade = document.querySelector("#inputCidade").value;
    if (inputCidade) {
        buscarCidade(inputCidade);
    } else {
        alert("Por favor, digite o nome de uma cidade.");
    }
}