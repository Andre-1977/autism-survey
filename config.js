// Configurações globais do formulário
const CONFIG = {
    // Email para envio das respostas
    email: 'andre.scrummaster@gmail.com',
    
    // URLs
    redirectUrl: 'agradecimento.html',
    homeUrl: 'index.html',
    
    // Configurações do FormSubmit
    formSubmitConfig: {
        // Configurações básicas
        _next: 'agradecimento.html',
        _template: 'table',
        _captcha: false,
        _subject: 'Nova resposta - Formulário de Pesquisa sobre Autismo',
        _cc: 'andre.scrummaster@gmail.com',
        _replyto: 'andre.scrummaster@gmail.com',
        _autoresponse: 'Obrigado por participar da nossa pesquisa! Suas respostas foram recebidas com sucesso.',
        
        // Configurações de segurança
        _honeypot: false,
        _disableCORS: true,
        _format: 'plain',
        _gotcha: false
    },
    
    // Tempo máximo de tentativas de envio (em segundos)
    maxRetryTime: 30,
    
    // Intervalo entre tentativas (em segundos)
    retryInterval: 5
}; 
