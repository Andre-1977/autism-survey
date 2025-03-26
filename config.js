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
        subject: 'Nova resposta - Formulário de Pesquisa sobre Autismo',
        autoresponse: 'Obrigado por participar da nossa pesquisa! Suas respostas foram recebidas com sucesso.',
        cc: 'andre.scrummaster@gmail.com',
        replyto: 'andre.scrummaster@gmail.com',
        // Configurações específicas para garantir o funcionamento
        honeypot: false,
        disableCORS: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Configurações adicionais
        _next: 'agradecimento.html',
        _template: 'table',
        _subject: 'Nova resposta - Formulário de Pesquisa sobre Autismo',
        _cc: 'andre.scrummaster@gmail.com',
        _replyto: 'andre.scrummaster@gmail.com',
        _autoresponse: 'Obrigado por participar da nossa pesquisa! Suas respostas foram recebidas com sucesso.'
    },
    
    // Tempo máximo de tentativas de envio (em segundos)
    maxRetryTime: 30,
    
    // Intervalo entre tentativas (em segundos)
    retryInterval: 5
}; 
