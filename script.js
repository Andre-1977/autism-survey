document.addEventListener('DOMContentLoaded', function() {
    // Complete sections implementation would go here
    // This is a simplified version just showing section navigation

    // Add click event to the "Next" button
    document.getElementById('next1').addEventListener('click', function() {
        alert(`
Formulário de Pesquisa sobre Autismo

Este é um protótipo da primeira seção do formulário. 
Em uma implementação completa, haveria mais 4 seções:

Seção 2: PERFIL DA CRIANÇA
Seção 3: APRENDIZAGEM E DESENVOLVIMENTO
Seção 4: TECNOLOGIA E RECURSOS
Seção 5: NECESSIDADES E EXPECTATIVAS

Cada seção teria campos específicos para coletar dados detalhados
sobre a experiência com crianças autistas, tecnologias educacionais
e necessidades de aprendizagem.
        `);
    });

    // Validation function (simplified)
    function validateSection(sectionId) {
        const section = document.getElementById(sectionId);
        const requiredInputs = section.querySelectorAll('input[required], select[required]');
        
        let valid = true;
        
        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                // For radio buttons, check if any in the group is checked
                const name = input.name;
                const checked = section.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    valid = false;
                    // Highlight the label
                    const label = input.closest('.form-group').querySelector('label');
                    label.style.color = 'red';
                }
            } else if (input.type === 'checkbox') {
                // For checkbox groups, at least one should be checked
                const name = input.name;
                const checked = section.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    valid = false;
                    // Highlight the label
                    const label = input.closest('.form-group').querySelector('label');
                    label.style.color = 'red';
                }
            } else if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = 'red';
            }
        });
        
        return valid;
    }

    // Example of "Other" option handling
    function setupOtherOptions() {
        // This would handle the "Other" option text fields
        // enabling/disabling them based on checkbox state
        const otherCheckboxes = document.querySelectorAll('[id$="_other_checkbox"]');
        
        otherCheckboxes.forEach(checkbox => {
            if (!checkbox) return;
            
            const textId = checkbox.id.replace('_checkbox', '_text');
            const textInput = document.getElementById(textId);
            
            if (textInput) {
                // Initial state
                textInput.disabled = !checkbox.checked;
                
                // Add event listener
                checkbox.addEventListener('change', function() {
                    textInput.disabled = !this.checked;
                });
            }
        });
    }
    
    // Call setup function
    setupOtherOptions();
}); 
