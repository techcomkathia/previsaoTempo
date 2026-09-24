# Dev Previsão - Aplicação de Previsão do Tempo

Uma aplicação web moderna e profissional de previsão do tempo que fornece informações climáticas em tempo real com uma interface intuitiva e responsiva.

## 🌍 Características Principais

- ✅ **Busca de Cidades**: Digite o nome de qualquer cidade para obter previsões meteorológicas
- 🌡️ **Informações Detalhadas**: Temperatura, umidade e descrição do clima em português
- 🖼️ **Fundo Dinâmico**: Imagens de fundo mudam de acordo com as condições climáticas
- 😊 **Emojis Descritivos**: Representação visual rápida do tipo de tempo
- 🔔 **Notificações Toast**: Sistema elegante de notificação na interface
- 🚀 **Sem Dependências Externas**: Nenhuma biblioteca pesada necessária
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica da página |
| **CSS3** | Estilização responsiva e animações |
| **JavaScript (ES6+)** | Lógica da aplicação com async/await |
| **Open-Meteo API** | Dados meteorológicos (gratuito, sem chave) |
| **Geocoding API** | Busca de coordenadas de cidades |

## 🎯 Como Funciona

1. **Busca de Coordenadas**: A aplicação busca a latitude e longitude da cidade através da API Open-Meteo Geocoding
2. **Requisição de Dados**: Com as coordenadas, faz requisição dos dados climáticos atuais
3. **Processamento**: Converte códigos de tempo em descrições e emojis em português
4. **Exibição**: Mostra os dados e altera o fundo com imagem correspondente ao tipo de clima

## 📋 Estrutura do Projeto

```
previsaoTempo/
├── index.html          # Interface HTML
├── styles.css          # Estilos da aplicação
├── script.js           # Lógica JavaScript (com JSDoc)
├── images/             # Imagens locais por código de tempo
│   ├── 0.jpg          # Céu limpo
│   ├── 1.jpg          # Principalmente claro
│   ├── ... 
│   └── 99.jpg         # Trovoada com granizo forte
└── README.md          # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em seu navegador
2. A cidade padrão **Fortaleza** será carregada automaticamente
3. Use o campo de busca para procurar outras cidades
4. Clique nos botões de sugestão rápida para cidades pré-definidas

## 💡 Boas Práticas Implementadas

- ✅ **Documentação JSDoc**: Todas as funções têm documentação completa
- ✅ **Tratamento de Erros Robusto**: Mensagens amigáveis sem expor detalhes técnicos
- ✅ **Modo Debug Configurável**: Logs apenas em desenvolvimento
- ✅ **Validação de Entrada**: Verificação de dados antes do processamento
- ✅ **Separação de Responsabilidades**: Funções bem definidas e reutilizáveis
- ✅ **Performance Otimizada**: Sem APIs externas desnecessárias, imagens locais

## 🔧 Variáveis de Ambiente

No início do arquivo `script.js`:

```javascript
const DEBUG = false; // Altere para true para ver logs em desenvolvimento
```

## 📡 APIs Utilizadas

### Open-Meteo (Gratuito, sem limite)
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast**: `https://api.open-meteo.com/v1/forecast`

## 🎨 Códigos de Tempo Suportados

A aplicação suporta os seguintes códigos WMO:
- 0-3: Céu claro até nublado
- 45-48: Nevoeiro
- 51-55: Chuvisco
- 61-65: Chuva
- 71-77: Neve
- 80-82: Pancadas de chuva
- 85-86: Pancadas de neve
- 95-99: Trovoada

---

**Desenvolvido por**: Káthia Rocha  

