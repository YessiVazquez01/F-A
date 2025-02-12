document.addEventListener('DOMContentLoaded', function() {
  // Verificar si el usuario está logueado; si no, redirigir a login.html
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
    return;
  }
  
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Lógica para el botón de cierre de sesión
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  /* ==============================
     Gestión de Productos
  ============================== */
  let products = JSON.parse(localStorage.getItem('products')) || [];
  const tableBody = document.querySelector('#inventoryTable tbody');
  const form = document.getElementById('formProduct');
  const productIdInput = document.getElementById('productId');
  const nameInput = document.getElementById('name');
  const brandInput = document.getElementById('brand');
  const sizesInput = document.getElementById('sizes');
  const colorsInput = document.getElementById('colors');
  const priceInput = document.getElementById('price');
  const imageFileInput = document.getElementById('imageFile');
  const currentImageInput = document.getElementById('currentImage');
  const cancelEditBtn = document.getElementById('cancelEdit');

  let imageData = "";

  function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
  }

  function renderInventory() {
    tableBody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.brand}</td>
      <td>${product.sizes ? product.sizes.join(', ') : 'N/A'}</td>
      <td>${product.colors ? product.colors.join(', ') : 'N/A'}</td>
      <td>$${product.price}</td>
      <td><img src="${product.image}" alt="${product.name}" style="width:50px; height:50px; object-fit:cover;"></td>
      <td>
        <button data-id="${product.id}" class="edit">Editar</button>
        <button data-id="${product.id}" class="delete">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
  }

  imageFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function() {
        imageData = reader.result;
      }
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = productIdInput.value;
    const name = nameInput.value;
    const brand = brandInput.value;
    const price = parseFloat(priceInput.value);
    // Obtener tallas y colores; se esperan valores separados por coma
    const sizes = sizesInput.value ? sizesInput.value.split(',').map(s => s.trim()).filter(s => s !== "") : [];
    const colors = colorsInput.value ? colorsInput.value.split(',').map(c => c.trim()).filter(c => c !== "") : [];
    const image = imageData || currentImageInput.value || 'https://via.placeholder.com/150';

    if (id) {
      // Modo edición
      const index = products.findIndex(p => p.id == id);
      if (index > -1) {
        products[index] = { id: parseInt(id), name, brand, price, image, sizes, colors };
      }
    } else {
      // Modo agregar
      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      products.push({ id: newId, name, brand, price, image, sizes, colors });
    }
    saveProducts();
    renderInventory();
    form.reset();
    productIdInput.value = '';
    currentImageInput.value = '';
    sizesInput.value = '';
    colorsInput.value = '';
    imageData = "";
    cancelEditBtn.style.display = 'none';
  });

  tableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit')) {
      const id = e.target.getAttribute('data-id');
      const product = products.find(p => p.id == id);
      if (product) {
        productIdInput.value = product.id;
        nameInput.value = product.name;
        brandInput.value = product.brand;
        // Si existen tallas y colores, unirlos en una cadena separada por comas
        sizesInput.value = product.sizes ? product.sizes.join(', ') : '';
        colorsInput.value = product.colors ? product.colors.join(', ') : '';
        priceInput.value = product.price;
        currentImageInput.value = product.image;
        cancelEditBtn.style.display = 'inline';
      }
    } else if (e.target.classList.contains('delete')) {
      const id = e.target.getAttribute('data-id');
      products = products.filter(p => p.id != id);
      saveProducts();
      renderInventory();
    }
  });

  cancelEditBtn.addEventListener('click', function() {
    form.reset();
    productIdInput.value = '';
    currentImageInput.value = '';
    sizesInput.value = '';
    colorsInput.value = '';
    imageData = "";
    cancelEditBtn.style.display = 'none';
  });

  renderInventory();

  /* ==============================
     Gestión de Usuarios (solo para Administrador)
     (Se mantiene el código anterior para habilitar/deshabilitar usuarios)
  ============================== */
  function renderUserManagement() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userTableBody = document.querySelector("#userTable tbody");
    userTableBody.innerHTML = "";
    users.forEach(user => {
      let actionButton = "";
      if (user.role !== "admin") {
        if (user.enabled) {
          actionButton = `<button class="toggleUser" data-username="${user.username}" data-action="disable">Deshabilitar</button>`;
        } else {
          actionButton = `<button class="toggleUser" data-username="${user.username}" data-action="enable">Habilitar</button>`;
        }
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.username}</td>
        <td>${user.role}</td>
        <td>${user.enabled ? "Habilitado" : "Pendiente"}</td>
        <td>${actionButton}</td>
      `;
      userTableBody.appendChild(tr);
    });

    document.querySelectorAll(".toggleUser").forEach(button => {
      button.addEventListener("click", function() {
        const username = this.getAttribute("data-username");
        const action = this.getAttribute("data-action");
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.map(u => {
          if(u.username === username) {
            u.enabled = (action === "enable");
          }
          return u;
        });
        localStorage.setItem("users", JSON.stringify(users));
        renderUserManagement();
      });
    });
  }

  if (loggedInUser.role === "admin") {
    renderUserManagement();
  } else {
    const userManagementSection = document.getElementById("userManagement");
    if(userManagementSection) {
      userManagementSection.style.display = "none";
    }
  }
});
