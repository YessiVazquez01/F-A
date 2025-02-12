document.addEventListener("DOMContentLoaded", function() {
    // Simular "base de datos" de usuarios usando localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Elementos del DOM
    const loginFormContainer = document.getElementById("loginFormContainer");
    const registerFormContainer = document.getElementById("registerFormContainer");
    const showRegisterLink = document.getElementById("showRegister");
    const showLoginLink = document.getElementById("showLogin");
  
    // Alternar entre formulario de login y registro
    showRegisterLink.addEventListener("click", function(e) {
      e.preventDefault();
      loginFormContainer.style.display = "none";
      registerFormContainer.style.display = "block";
    });
  
    showLoginLink.addEventListener("click", function(e) {
      e.preventDefault();
      registerFormContainer.style.display = "none";
      loginFormContainer.style.display = "block";
    });
  
    // Manejo del formulario de login
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      
      const user = users.find(u => u.username === username && u.password === password);
      if(user) {
        // Verificar si el usuario está habilitado
        if (!user.enabled) {
          alert("Su cuenta aún no ha sido habilitada por el administrador.");
          return;
        }
        // Login exitoso: guardar el usuario en sesión y redirigir al panel de administración
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "admin.html";
      } else {
        alert("Credenciales inválidas");
      }
    });
  
    // Manejo del formulario de registro
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("registerUsername").value.trim();
      const password = document.getElementById("registerPassword").value.trim();
  
      // Verificar si el usuario ya existe
      if(users.some(u => u.username === username)) {
        alert("El usuario ya existe, por favor elige otro.");
        return;
      }
  
      // Crear el nuevo usuario
      let newUser = { username, password };
      if(users.length === 0) {
        // La primera cuenta es el Administrador Supremo
        newUser.role = "admin";
        newUser.enabled = true;
        alert("Cuenta creada como Administrador Supremo.");
      } else {
        newUser.role = "user";
        newUser.enabled = false;
        alert("Cuenta creada. Espere a que el administrador la habilite.");
      }
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Cambiar a formulario de login
      registerFormContainer.style.display = "none";
      loginFormContainer.style.display = "block";
    });
  });
  