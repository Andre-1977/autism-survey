document.addEventListener('DOMContentLoaded', function() {
    // Identificar qual formulário está sendo exibido
    const parentForm = document.getElementById('parentSurvey');
    const teacherForm = document.getElementById('teacherSurvey');
    const professionalForm = document.getElementById('professionalSurvey');
    
    // Identificar o formulário atual
    let currentForm = null;
    let formType = '';
    if (parentForm) {
        currentForm = parentForm;
        formType = 'parent';
    } else if (teacherForm) {
        currentForm = teacherForm;
        formType = 'teacher';
    } else if (professionalForm) {
        currentForm = professionalForm;
        formType = 'professional';
    }
    
    if (!currentForm) return; // Sair se não houver formulário
    
    // Configurações gerais do formulário
    const sections = currentForm.querySelectorAll('.form-section');
    const progressBar = currentForm.closest('.container').querySelector('.progress');
    const progressText = currentForm.closest('.container').querySelector('.progress-text');
    let currentSection = 1;
    const totalSections = 5;

    // Configurar campo de localização para formulário de profissionais
    if (formType === 'professional') {
        const locationSelect = document.getElementById('location_select');
        const locationOtherGroup = document.getElementById('location_other_group');
        
        // Esconder o campo de 'outra localização' inicialmente
        if (locationOtherGroup) {
            locationOtherGroup.style.display = 'none';
        }
        
        // Adicionar evento para exibir o campo quando 'outro' for selecionado
        if (locationSelect && locationOtherGroup) {
            locationSelect.addEventListener('change', function() {
                if (this.value === 'outro' || this.value === 'exterior') {
                    locationOtherGroup.style.display = 'block';
                } else {
                    locationOtherGroup.style.display = 'none';
                    // Limpar o campo de texto quando não estiver sendo usado
                    document.getElementById('location_other').value = '';
                }
            });
            
            // Verificar estado inicial (importante para respostas carregadas)
            if (locationSelect.value === 'outro' || locationSelect.value === 'exterior') {
                locationOtherGroup.style.display = 'block';
            }
        }
    }

    // Função para salvar respostas temporárias
    function saveTemporaryResponses() {
        const formData = new FormData(currentForm);
        const responses = {};
        
        for (let [name, value] of formData.entries()) {
            // Lidar com arrays (checkboxes)
            if (name.endsWith('[]')) {
                const cleanName = name.replace('[]', '');
                if (!responses[cleanName]) {
                    responses[cleanName] = [];
                }
                responses[cleanName].push(value);
            } else {
                responses[name] = value;
            }
        }
        
        // Adicionar tipo de formulário e data/hora
        responses.formType = formType;
        responses.submissionDate = new Date().toISOString();
        
        // Verificar valores adicionais que podem não estar no FormData (como checkboxes não marcados)
        const checkboxGroups = currentForm.querySelectorAll('.checkbox-group');
        checkboxGroups.forEach(group => {
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            const name = checkboxes.length > 0 ? checkboxes[0].name.replace('[]', '') : null;
            if (name && !responses[name]) {
                responses[name] = [];
            }
        });
        
        // Salvar temporariamente
        localStorage.setItem('autismSurveyTempData', JSON.stringify(responses));
        
        return responses;
    }
    
    // Função para carregar respostas temporárias
    function loadTemporaryResponses() {
        const savedData = localStorage.getItem('autismSurveyTempData');
        if (savedData) {
            try {
                const responses = JSON.parse(savedData);
                if (responses.formType === formType) {
                    // Preencher os campos com os dados salvos
                    for (const [name, value] of Object.entries(responses)) {
                        if (name === 'formType' || name === 'submissionDate') continue;
                        
                        if (Array.isArray(value)) {
                            // Checkboxes
                            value.forEach(val => {
                                const checkbox = currentForm.querySelector(`input[name="${name}[]"][value="${val}"]`);
                                if (checkbox) checkbox.checked = true;
                            });
                        } else {
                            // Outros campos
                            const field = currentForm.querySelector(`[name="${name}"]`);
                            if (field) {
                                if (field.type === 'checkbox' || field.type === 'radio') {
                                    field.checked = true;
                                } else {
                                    field.value = value;
                                }
                            }
                        }
                    }
                    
                    // Verificar opções "Outro"
                    setupOtherOptions();
                    
                    // Verificar a opção de localização para formulário de profissionais
                    if (formType === 'professional') {
                        const locationSelect = document.getElementById('location_select');
                        const locationOtherGroup = document.getElementById('location_other_group');
                        
                        if (locationSelect && locationOtherGroup && 
                            (locationSelect.value === 'outro' || locationSelect.value === 'exterior')) {
                            locationOtherGroup.style.display = 'block';
                        }
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar dados temporários:', e);
            }
        }
    }
    
    // Funções para salvar e gerenciar respostas
    function saveResponses(responses) {
        // Obter respostas existentes ou criar nova lista
        console.log('Salvando respostas...');
        let allResponses = JSON.parse(localStorage.getItem('autismSurveyResponses') || '[]');
        console.log('Respostas existentes:', allResponses.length);
        
        // Adicionar ID único para esta resposta
        responses.id = 'response_' + Date.now();
        console.log('ID gerado:', responses.id);
        
        // Adicionar às respostas existentes
        allResponses.push(responses);
        console.log('Novas respostas total:', allResponses.length);
        
        // Salvar no localStorage
        try {
            const jsonString = JSON.stringify(allResponses);
            console.log('Tamanho do JSON:', jsonString.length, 'bytes');
            localStorage.setItem('autismSurveyResponses', jsonString);
            console.log('Resposta salva com sucesso');
            
            // Verificar se foi salvo corretamente
            const verificacao = localStorage.getItem('autismSurveyResponses');
            console.log('Verificação de salvamento:', verificacao ? 'OK' : 'Falha');
            
            // Estimativa do espaço utilizado no localStorage
            let totalSize = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                totalSize += (key.length + value.length) * 2; // aproximado em bytes
            }
            console.log('Espaço total usado no localStorage:', (totalSize / 1024).toFixed(2), 'KB');
            console.log('Limite típico do localStorage:', '5-10 MB');
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            alert('Erro ao salvar: ' + e.message);
        }
        
        // Limpar dados temporários
        localStorage.removeItem('autismSurveyTempData');
        
        return responses.id;
    }
    
    // Função para converter para CSV
    function convertToCSV(responses) {
        if (!responses || responses.length === 0) return '';
        
        // Coletar todos os cabeçalhos possíveis
        const headers = new Set();
        responses.forEach(response => {
            Object.keys(response).forEach(key => headers.add(key));
        });
        
        const headerRow = Array.from(headers).join(',');
        
        // Criar linhas de dados
        const rows = responses.map(response => {
            return Array.from(headers).map(header => {
                const value = response[header];
                if (value === undefined || value === null) return '';
                
                // Lidar com arrays
                if (Array.isArray(value)) {
                    return `"${value.join('; ')}"`;
                }
                
                // Escape strings for CSV
                if (typeof value === 'string') {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                
                return value;
            }).join(',');
        });
        
        return headerRow + '\n' + rows.join('\n');
    }
    
    // Função para exportar para CSV
    function exportToCSV() {
        const responses = JSON.parse(localStorage.getItem('autismSurveyResponses') || '[]');
        if (responses.length === 0) {
            alert('Não há respostas para exportar.');
            return;
        }
        
        const csv = convertToCSV(responses);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'respostas_pesquisa_autismo.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Atualizar a barra de progresso
    function updateProgress() {
        const progressPercentage = (currentSection / totalSections) * 100;
        progressBar.style.width = progressPercentage + '%';
        progressText.textContent = `Seção ${currentSection} de ${totalSections}`;
        
        // Salvar progresso atual
        saveTemporaryResponses();
    }
    
    // Mostrar uma seção específica
    function showSection(sectionNumber) {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`section${sectionNumber}`).classList.add('active');
        currentSection = sectionNumber;
        updateProgress();
        window.scrollTo(0, 0); // Rolar para o topo
    }
    
    // Validar uma seção do formulário
    function validateSection(sectionId) {
        // Sempre retorna válido, tornando todos os campos opcionais
        return true;
        
        /* Código de validação original comentado:
        const section = document.getElementById(sectionId);
        const requiredInputs = section.querySelectorAll('input[required], select[required], textarea[required]');
        
        let valid = true;
        let firstInvalidElement = null;
        
        // Limpar mensagens de erro anteriores
        section.querySelectorAll('.error-message').forEach(el => el.remove());
        section.querySelectorAll('.error-highlight').forEach(el => el.classList.remove('error-highlight'));
        
        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                // Para botões de rádio, verificar se algum do grupo está marcado
                const name = input.name;
                const checked = section.querySelector(`input[name="${name}"]:checked`);
                
                if (!checked) {
                    valid = false;
                    
                    // Verificar se já existe mensagem de erro para este grupo
                    const formGroup = input.closest('.form-group');
                    const errorExists = formGroup.querySelector('.error-message');
                    
                    if (!errorExists) {
                        // Destacar o rótulo
                        const label = formGroup.querySelector('label');
                        label.classList.add('error-highlight');
                        
                        // Adicionar mensagem de erro
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Este campo é obrigatório';
                        formGroup.appendChild(errorMessage);
                        
                        // Guardar o primeiro elemento inválido para focar nele
                        if (!firstInvalidElement) firstInvalidElement = input;
                    }
                }
            } else if (input.type === 'checkbox' && input.required) {
                // Para grupos de checkbox onde pelo menos um é obrigatório
                const name = input.name.replace('[]', '');
                const formGroup = input.closest('.form-group');
                
                // Verificar se já existe uma mensagem de erro
                const errorExists = formGroup.querySelector('.error-message');
                
                // Verificar se algum checkbox está marcado
                const checked = formGroup.querySelector(`input[name^="${name}"]:checked`);
                
                if (!checked && !errorExists) {
                    valid = false;
                    
                    // Destacar o rótulo
                    const label = formGroup.querySelector('label');
                    label.classList.add('error-highlight');
                    
                    // Adicionar mensagem de erro
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Selecione pelo menos uma opção';
                    formGroup.appendChild(errorMessage);
                    
                    // Guardar o primeiro elemento inválido para focar nele
                    if (!firstInvalidElement) firstInvalidElement = input;
                }
            } else if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
                if (!input.value.trim()) {
                    valid = false;
                    
                    // Destacar o input
                    input.classList.add('error-highlight');
                    
                    // Adicionar mensagem de erro
                    const formGroup = input.closest('.form-group');
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Este campo é obrigatório';
                    formGroup.appendChild(errorMessage);
                    
                    // Guardar o primeiro elemento inválido para focar nele
                    if (!firstInvalidElement) firstInvalidElement = input;
                }
            }
        });
        
        // Focar no primeiro elemento inválido
        if (firstInvalidElement) {
            firstInvalidElement.focus();
        }
        
        return valid;
        */
    }
    
    // Configurar tratamento de opções "Outro"
    function setupOtherOptions() {
        const otherCheckboxes = document.querySelectorAll('[id$="_other_checkbox"]');
        
        otherCheckboxes.forEach(checkbox => {
            if (!checkbox) return;
            
            const textId = checkbox.id.replace('_checkbox', '_text');
            const textInput = document.getElementById(textId);
            
            if (textInput) {
                // Estado inicial
                textInput.disabled = !checkbox.checked;
                
                // Adicionar listener
                checkbox.addEventListener('change', function() {
                    textInput.disabled = !this.checked;
                    if (this.checked) {
                        textInput.focus();
                    }
                });
            }
        });
    }
    
    // Configurar botões de navegação
    function setupNavigationButtons() {
        // Botões "Próxima Seção"
        for (let i = 1; i < totalSections; i++) {
            const nextButton = document.getElementById(`next${i}`);
            if (nextButton) {
                nextButton.addEventListener('click', function() {
                    if (validateSection(`section${i}`)) {
                        showSection(i + 1);
                    }
                });
            }
        }
        
        // Botões "Seção Anterior"
        for (let i = 2; i <= totalSections; i++) {
            const prevButton = document.getElementById(`prev${i}`);
            if (prevButton) {
                prevButton.addEventListener('click', function() {
                    showSection(i - 1);
                });
            }
        }
        
        // Botão de envio
        const submitButton = document.getElementById('submit');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateSection(`section${totalSections}`)) {
                    // Salvar respostas
                    const responses = saveTemporaryResponses();
                    
                    try {
                        // Salvar no localStorage
                        const responseId = saveResponses(responses);
                        console.log('Resposta salva com ID:', responseId);
                        
                        // Verificar se a resposta foi realmente salva
                        const savedResponses = JSON.parse(localStorage.getItem('autismSurveyResponses') || '[]');
                        const saved = savedResponses.some(r => r.id === responseId);
                        
                        if (saved) {
                            // Mostrar alerta de sucesso
                            alert('Obrigado por participar da nossa pesquisa! Suas respostas foram salvas com sucesso.');
                            // Redirecionar para a página inicial
                            window.location.href = 'index.html';
                        } else {
                            alert('Houve um problema ao salvar suas respostas. Por favor, tente novamente.');
                            console.error('Resposta não encontrada após salvamento');
                        }
                    } catch (error) {
                        // Lidar com erros
                        console.error('Erro ao salvar respostas:', error);
                        alert('Houve um erro ao salvar suas respostas. Por favor, tente novamente.');
                    }
                }
            });
        }
    }
    
    // Inicializar o formulário
    function initForm() {
        // Verificar dados temporários salvos e carregar se existirem
        loadTemporaryResponses();
        
        updateProgress();
        setupOtherOptions();
        setupNavigationButtons();
        
        // Adicionar estilos CSS para mensagens de erro
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                color: #e74c3c;
                font-size: 14px;
                margin-top: 5px;
            }
            
            .error-highlight {
                color: #e74c3c;
                border-color: #e74c3c !important;
            }
            
            input.error-highlight, 
            select.error-highlight, 
            textarea.error-highlight {
                border-color: #e74c3c !important;
                background-color: rgba(231, 76, 60, 0.1);
            }
            
            .role-indicator {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }
            
            .back-link {
                color: #3498db;
                text-decoration: none;
            }
            
            .back-link:hover {
                text-decoration: underline;
            }
            
            .survey-admin-panel {
                margin-top: 20px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
                border: 1px solid #ddd;
            }
            
            .survey-admin-panel h3 {
                margin-top: 0;
            }
            
            .survey-admin-panel button {
                margin-right: 10px;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Expor função de exportação globalmente
    window.exportSurveyResponsesToCSV = exportToCSV;
    
    // Iniciar o formulário
    initForm();
}); 
