// Configurações globais do formulário
const CONFIG = {
    // Email para envio das respostas
    email: 'andre.scrummaster@gmail.com',
    
    // URLs
    redirectUrl: 'agradecimento.html',
    homeUrl: 'index.html',
    
    // Configurações do FormSubmit
    formSubmitConfig: {
        template: 'table',
        captcha: false,
        subject: 'Nova resposta - Formulário de Pesquisa sobre Autismo'
    },
    
    // Tempo máximo de tentativas de envio (em segundos)
    maxRetryTime: 30,
    
    // Intervalo entre tentativas (em segundos)
    retryInterval: 5
}; 
