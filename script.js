document.addEventListener('DOMContentLoaded', () => {

    
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

    
    const authLinksContainer = document.querySelector('.auth-links');
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

    if (loggedInUser && authLinksContainer) {
        const textColor = window.location.pathname.includes('admin') ? '#fff' : '#333';
        
        authLinksContainer.innerHTML = `
            <span style="color: ${textColor}; margin-right: 15px;">
                Вітаємо, <b>${loggedInUser.name}</b>!
            </span>
            <a href="#" id="logout-button" style="color: #d9534f; font-weight: bold;">Вийти</a>
        `;

        document.getElementById('logout-button').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser'); 
            showToast('Ви успішно вийшли з системи.', 'success');
            
            setTimeout(() => {
                if (window.location.pathname.includes('admin')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.reload();
                }
            }, 1000);
        });
    }

    
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim().toLowerCase();
            const password = document.getElementById('reg-password').value;

            let users = JSON.parse(localStorage.getItem('app_users')) || [];
            const userExists = users.some(user => user.email === email);

            if (userExists) {
                showToast('Користувач з таким E-mail вже існує!', 'error');
                return;
            }

            const newUser = { name: name, email: email, password: password };
            users.push(newUser);
            localStorage.setItem('app_users', JSON.stringify(users)); 

            showToast('Реєстрація успішна! Тепер ви можете увійти.', 'success');
            registerForm.reset(); 
        });
    }

    
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value;

            let users = JSON.parse(localStorage.getItem('app_users')) || [];
            const foundUser = users.find(user => user.email === email && user.password === password);
            
            // Хардкод для швидкого входу в адмінку (admin@ntu.edu.ua / admin123)
            const isAdmin = (email === 'admin@ntu.edu.ua' && password === 'admin123');

            if (foundUser) {
                localStorage.setItem('currentUser', JSON.stringify(foundUser)); 
                showToast(`Вітаємо, ${foundUser.name}! Авторизація успішна.`, 'success');
                setTimeout(() => window.location.href = 'index.html', 1500);
            } else if (isAdmin) {
                localStorage.setItem('currentUser', JSON.stringify({ name: 'Адміністратор', role: 'admin' }));
                showToast('Вітаємо, Адміністратор!', 'success');
                setTimeout(() => window.location.href = 'admin.html', 1500);
            } else {
                showToast('Помилка входу! Невірний E-mail або пароль.', 'error');
            }
        });
    }

   
    document.querySelectorAll('form').forEach(form => {
        if (form.id === 'login-form' || form.id === 'register-form') return;

        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            let isValid = true;
            
            form.querySelectorAll('[required], input[type="text"], textarea').forEach(field => {
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