// Função para identificar qual formulário está sendo exibido
function identifyFormType() {
    if (document.querySelector('form[data-form-type="pais"]')) {
        return 'pais';
    } else if (document.querySelector('form[data-form-type="professores"]')) {
        return 'professores';
    } else if (document.querySelector('form[data-form-type="profissionais"]')) {
        return 'profissionais';
    }
    return 'desconhecido';
}

// Configuração inicial da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando configuração...');
    setupFormSections();
    setupEventListeners();
    setupConditionalQuestions();
    
    // Adicionar IDs únicos no carregamento da página 
    if (document.getElementById('form_unique_id')) {
        document.getElementById('form_unique_id').value = generateUniqueId();
    }
    
    if (document.getElementById('form_timestamp')) {
        document.getElementById('form_timestamp').value = new Date().toISOString();
    }
});

// Configura as seções do formulário e botões de navegação
function setupFormSections() {
    const formSections = document.querySelectorAll('.form-section');
    console.log('Número de seções encontradas:', formSections.length);
    
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    
    // Esconder todas as seções, exceto a primeira
    formSections.forEach((section, index) => {
        section.classList.remove('active');
        if (index === 0) {
            section.classList.add('active');
            console.log('Primeira seção ativada:', section.id);
        }
    });
    
    // Atualizar progresso se existir
    if (progressBar && progressText) {
        updateProgress(0, formSections.length);
    }
}

// Configura listeners de eventos para os elementos do formulário
function setupEventListeners() {
    // Configurar botões de próximo e anterior
    const nextButtons = document.querySelectorAll('.btn-next');
    console.log('Botões "Próximo" encontrados:', nextButtons.length);
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão próximo clicado');
            
            const currentSection = this.closest('.form-section');
            const nextSection = currentSection.nextElementSibling;
            const currentIndex = Array.from(document.querySelectorAll('.form-section')).indexOf(currentSection);
            const totalSections = document.querySelectorAll('.form-section').length;
            
            console.log('Seção atual:', currentSection.id);
            console.log('Próxima seção:', nextSection ? nextSection.id : 'não encontrada');
            
            // Validar campos da seção atual antes de avançar
            if (validateSection(currentSection)) {
                console.log('Validação passou, avançando para próxima seção');
                currentSection.classList.remove('active');
                if (nextSection) {
                    nextSection.classList.add('active');
                    updateProgress(currentIndex + 1, totalSections);
                    window.scrollTo(0, 0);
                }
            } else {
                console.log('Validação falhou, não avançando');
            }
        });
    });
    
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const currentSection = this.closest('.form-section');
            const prevSection = currentSection.previousElementSibling;
            const currentIndex = Array.from(document.querySelectorAll('.form-section')).indexOf(currentSection);
            const totalSections = document.querySelectorAll('.form-section').length;
            
            if (prevSection) {
                currentSection.classList.remove('active');
                prevSection.classList.add('active');
                updateProgress(currentIndex - 1, totalSections);
                window.scrollTo(0, 0);
            }
        });
    });
    
    // Botão de enviar
    document.querySelectorAll('.btn-submit').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de envio clicado');
            
            const form = this.closest('form');
            const currentSection = this.closest('.form-section');
            
            // Validar a última seção antes de enviar
            if (validateSection(currentSection)) {
                console.log('Validação passou, preparando envio');
                
                // Salvar cópia local antes de enviar
                saveLocalBackup(form);
                
                // Enviar o formulário
                if (form && form.action) {
                    console.log('Enviando formulário para:', form.action);
                    
                    // Criar um formulário temporário para envio
                    const tempForm = document.createElement('form');
                    tempForm.method = 'POST';
                    tempForm.action = form.action;
                    
                    // Copiar todos os campos do formulário original
                    form.querySelectorAll('input, select, textarea').forEach(element => {
                        if (element.name) {
                            const clone = element.cloneNode(true);
                            tempForm.appendChild(clone);
                        }
                    });
                    
                    // Adicionar campos ocultos necessários para o FormSubmit
                    const nextInput = document.createElement('input');
                    nextInput.type = 'hidden';
                    nextInput.name = '_next';
                    nextInput.value = 'agradecimento.html';
                    tempForm.appendChild(nextInput);
                    
                    const captchaInput = document.createElement('input');
                    captchaInput.type = 'hidden';
                    captchaInput.name = '_captcha';
                    captchaInput.value = 'false';
                    tempForm.appendChild(captchaInput);
                    
                    // Adicionar o formulário temporário ao documento e enviar
                    document.body.appendChild(tempForm);
                    tempForm.submit();
                    document.body.removeChild(tempForm);
                } else {
                    console.error('Formulário não encontrado ou sem action definido');
                    alert('Erro ao enviar formulário. Por favor, tente novamente.');
                }
            } else {
                console.log('Validação falhou, não enviando formulário');
            }
        });
    });
}

// Atualiza a barra de progresso
function updateProgress(currentIndex, totalSections) {
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const percentage = ((currentIndex + 1) / totalSections) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `Seção ${currentIndex + 1} de ${totalSections}`;
    }
}

// Configura perguntas que devem aparecer baseadas em respostas anteriores
function setupConditionalQuestions() {
    // Configurar campos relacionados a "outros"
    document.querySelectorAll('input[type="checkbox"][id$="_other_checkbox"]').forEach(checkbox => {
        const textInput = document.getElementById(checkbox.id.replace('_checkbox', '_text'));
        if (textInput) {
            // Estado inicial
            textInput.disabled = !checkbox.checked;
            
            // Escutar mudanças
            checkbox.addEventListener('change', function() {
                textInput.disabled = !this.checked;
                if (this.checked) {
                    textInput.focus();
                } else {
                    textInput.value = '';
                }
            });
        }
    });
}

// Valida campos obrigatórios em uma seção
function validateSection(section) {
    let isValid = true;
    const requiredFields = section.querySelectorAll('[required]');
    
    // Se não houver campos obrigatórios, considerar válido
    if (requiredFields.length === 0) {
        console.log('Nenhum campo obrigatório encontrado na seção, considerando válido');
        return true;
    }
    
    requiredFields.forEach(field => {
        // Verificar se é um grupo de radio buttons
        if (field.type === 'radio') {
            const name = field.name;
            const radioGroup = section.querySelectorAll(`input[name="${name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            
            if (!isChecked) {
                isValid = false;
                showError(field, 'Por favor, selecione uma opção.');
            } else {
                removeError(field);
            }
        } 
        // Verificar se é um grupo de checkboxes
        else if (field.type === 'checkbox') {
            const name = field.name;
            const checkboxGroup = section.querySelectorAll(`input[name="${name}"]`);
            const isChecked = Array.from(checkboxGroup).some(checkbox => checkbox.checked);
            
            if (!isChecked) {
                isValid = false;
                showError(field, 'Por favor, selecione pelo menos uma opção.');
            } else {
                removeError(field);
            }
        }
        // Verificar campos de texto e email
        else if (field.type === 'text' || field.type === 'email') {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'Este campo é obrigatório.');
            } else {
                removeError(field);
            }
        }
        // Verificar campos select
        else if (field.tagName === 'SELECT') {
            if (!field.value) {
                isValid = false;
                showError(field, 'Por favor, selecione uma opção.');
            } else {
                removeError(field);
            }
        }
        // Verificar outros tipos de campos
        else if (!field.value.trim()) {
            isValid = false;
            showError(field, 'Este campo é obrigatório.');
        } else {
            removeError(field);
        }
    });
    
    if (!isValid) {
        console.log('Validação falhou na seção:', section.id);
        alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
    } else {
        console.log('Validação passou na seção:', section.id);
    }
    
    return isValid;
}

// Mostra mensagem de erro para um campo
function showError(field, message) {
    field.classList.add('invalid');
    
    // Verificar se já existe mensagem de erro
    let errorMsg = field.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        errorMsg = document.createElement('span');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = message;
        
        // Para radio buttons, adicionar após o label pai
        if (field.type === 'radio') {
            const parentLabel = field.closest('label');
            if (parentLabel && parentLabel.parentNode) {
                parentLabel.parentNode.appendChild(errorMsg);
            } else {
                field.parentNode.appendChild(errorMsg);
            }
        } else {
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
    }
}

// Remove mensagem de erro de um campo
function removeError(field) {
    field.classList.remove('invalid');
    
    // Se for radio, procurar o erro no grupo
    if (field.type === 'radio') {
        const name = field.name;
        const group = document.querySelectorAll(`input[name="${name}"]`);
        const lastRadio = group[group.length - 1];
        if (lastRadio) {
            const parentDiv = lastRadio.closest('.radio-group');
            if (parentDiv) {
                const errorMsg = parentDiv.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        }
    } else {
        // Para outros tipos de campos
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }
}

// Gera um ID único para a resposta
function generateUniqueId() {
    return 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Salva uma cópia local dos dados do formulário como backup
function saveLocalBackup(form) {
    try {
        const formData = {};
        
        // Coletar todos os dados do formulário
        form.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.name && !element.name.startsWith('_')) {
                // Para checkboxes e radio buttons
                if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
                    return;
                }
                
                // Para inputs e textareas
                if (element.type === 'checkbox') {
                    // Checkbox pode ter múltiplos valores
                    if (!formData[element.name]) {
                        formData[element.name] = [];
                    }
                    if (Array.isArray(formData[element.name])) {
                        formData[element.name].push(element.value);
                    }
                } else {
                    formData[element.name] = element.value;
                }
            }
        });
        
        // Adicionar timestamp e tipo de formulário (se não existir)
        if (!formData.dataEnvio) {
            formData.dataEnvio = new Date().toISOString();
        }
        
        if (!formData.id) {
            formData.id = generateUniqueId();
        }
        
        if (!formData.tipoFormulario) {
            const formElement = document.querySelector('form');
            if (formElement && formElement.dataset.formType) {
                formData.tipoFormulario = formElement.dataset.formType;
            }
        }
        
        // Recuperar respostas existentes ou iniciar array vazio
        let responses = JSON.parse(localStorage.getItem('surveyResponses')) || [];
        
        // Adicionar nova resposta
        responses.push(formData);
        
        // Salvar de volta no localStorage
        localStorage.setItem('surveyResponses', JSON.stringify(responses));
        
        console.log('Dados salvos localmente como backup');
    } catch (error) {
        console.error('Erro ao salvar dados localmente:', error);
    }
} 
