document.addEventListener('DOMContentLoaded', () => {
    // 1. ПІДКАЗКИ (TOOLTIPS)
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    document.body.appendChild(tooltip);

    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            tooltip.textContent = el.getAttribute('data-tooltip');
            tooltip.style.opacity = '1';
            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + window.scrollX + 'px';
            tooltip.style.top = rect.bottom + window.scrollY + 8 + 'px';
        });
        el.addEventListener('mouseleave', () => tooltip.style.opacity = '0');
    });

    // 2. СПЛИВАЮЧІ ПОВІДОМЛЕННЯ (TOASTS)
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.4s ease-out forwards';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };

    // 3. ПЕРЕХОПЛЕННЯ ФОРМ
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            let isValid = true;
            form.querySelectorAll('[required], input[type="text"], input[type="password"], textarea').forEach(field => {
                if (field.value.trim() === '') {
                    isValid = false;
                    field.style.borderColor = '#d9534f';
                    field.style.backgroundColor = '#fdf0f0';
                } else {
                    field.style.borderColor = '#cccccc';
                    field.style.backgroundColor = '#ffffff';
                }
            });

            if (isValid) {
                showToast('Успішно! Дані відправлено.', 'success');
                form.reset();
            } else {
                showToast('Помилка! Заповніть усі поля.', 'error');
            }
        });
    });

    // 4. ПЕРЕХОПЛЕННЯ ВИДАЛЕННЯ/БЛОКУВАННЯ
    document.querySelectorAll('a[onclick*="confirm"]').forEach(link => {
        const msg = link.getAttribute('onclick').match(/'([^']+)'/)[1] || 'Ви впевнені?';
        link.removeAttribute('onclick');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(msg)) {
                showToast('Дію успішно виконано!', 'success');
            } else {
                showToast('Дію скасовано.', 'error');
            }
        });
    });
});