// Función para manejar el indicador de navegación
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.main-nav ul li a');
    const indicator = document.querySelector('.nav-indicator');
    
    // Función para posicionar el indicador
    function positionIndicator(element) {
        if (!element || !indicator) return;
        
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.parentElement.getBoundingClientRect();
        
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - parentRect.left}px`;
        indicator.style.display = 'block';
    }
    
    // Posicionar el indicador en la página actual al cargar
    navItems.forEach(item => {
        if (item.classList.contains('active')) {
            positionIndicator(item);
        }
    });
    
    // Manejar eventos de mouse
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            positionIndicator(this);
        });
    });
    
    // Cuando el mouse sale del menú, volver al elemento activo
    const navContainer = document.querySelector('.main-nav ul');
    navContainer.addEventListener('mouseleave', function() {
        const activeItem = document.querySelector('.main-nav ul li a.active');
        if (activeItem) {
            positionIndicator(activeItem);
        } else {
            indicator.style.display = 'none';
        }
    });
});
    
    // Formulario de sugerencias (solo en la página de sugerencias)
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', function(e) {
            // Removemos e.preventDefault() para permitir el envío del formulario
            // Solo mostramos el mensaje de agradecimiento
            alert('¡Gracias por tu sugerencia! La revisaremos lo antes posible.');
        });
    }

    // Manejo del formulario de inicio de sesión
    // Manejo del formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordError = document.getElementById('passwordError');
            
            // Ocultar el mensaje de error al inicio
            passwordError.style.display = 'none';
            
            // Validación básica
            if (!email || !password) {
                return;
            }
            
            // Obtener datos del usuario registrado
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            // Verificar si el email y la contraseña coinciden
            if (email !== userData.email) {
                return;
            }
            
            // Verificar la contraseña
            const storedPassword = localStorage.getItem('password_' + email);
            if (password !== storedPassword) {
                passwordError.style.display = 'block';
                return;
            }
            
            // Si las credenciales son correctas, iniciar sesión
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Redirigir al usuario a la página principal
            window.location.href = 'index.html';
        });
    }

    // Manejo del formulario de registro
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordInput = document.getElementById('password');

        // Función para verificar las contraseñas
        function verificarContraseñas() {
            if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                passwordError.style.display = 'block';
                return false;
            } else {
                passwordError.style.display = 'none';
                return true;
            }
        }

        // Verificar mientras el usuario escribe
        confirmPasswordInput.addEventListener('input', verificarContraseñas);
        passwordInput.addEventListener('input', verificarContraseñas);

        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // Validación básica
            if (!nombre || !email || !password || !confirmPassword) {
                return;
            }
            
            if (!verificarContraseñas()) {
                return;
            }
            
            // Guardar datos básicos en localStorage
            const userData = {
                nombre: nombre,
                email: email,
                fechaRegistro: new Date().toISOString()
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            // Guardar la contraseña (en una aplicación real, esto se haría de forma segura en el servidor)
            localStorage.setItem('password_' + email, password);
            
            // Redirigir al usuario a la página principal
            window.location.href = 'index.html';
        });
    }

    // Verificar si el usuario está logueado y actualizar la interfaz
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                          sessionStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            // Obtener datos del usuario
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userEmail = userData.email || 
                             localStorage.getItem('userEmail') || 
                             sessionStorage.getItem('userEmail') || '';
            
            // Cambiar los botones de autenticación por información del usuario
            const authButtons = document.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.innerHTML = `
                    <div class="user-info">
                        <span class="user-email">${userEmail}</span>
                        <button id="logoutBtn" class="logout-btn">Cerrar sesión</button>
                    </div>
                `;
                
                // Agregar evento para cerrar sesión
                document.getElementById('logoutBtn').addEventListener('click', function() {
                    localStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    sessionStorage.removeItem('userEmail');
                    
                    // Recargar la página para actualizar la interfaz
                    window.location.reload();
                });
            }
        }
    }

    // Ejecutar la verificación de inicio de sesión al cargar la página
    document.addEventListener('DOMContentLoaded', function() {
        // Código existente del indicador de navegación
        // ...
        
        // Verificar estado de inicio de sesión
        checkLoginStatus();
    });