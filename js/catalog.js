document.addEventListener('DOMContentLoaded', function() {
  // Obtener o inicializar productos en localStorage (incluyendo tallas y colores)
  let products = JSON.parse(localStorage.getItem('products')) || [
    {
      id: 1,
      name: "Camiseta Deportiva",
      brand: "Adidas",
      price: 5000,
      image: "../img/IMG-20240323-WA0128.jpg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Rojo", "Azul", "Negro"]
    },
    {
      id: 2,
      name: "Pantalón Deportivo",
      brand: "Nike",
      price: 12000,
      image: "../img/IMG-20240323-WA0150.jpg",
      sizes: ["M", "L", "XL"],
      colors: ["Gris", "Negro"]
    }
  ];

  // Guardar en localStorage (en caso de inicialización)
  localStorage.setItem('products', JSON.stringify(products));

  const catalogDiv = document.getElementById('productCatalog');
  const filterButtonsContainer = document.getElementById('filterButtons');

  function renderCatalog(filter = '') {
    catalogDiv.innerHTML = '';
    let filtered = products;
    // Si se selecciona un filtro distinto de 'Todos', se filtra por marca
    if (filter && filter !== 'Todos') {
      filtered = products.filter(p => p.brand === filter);
    }
    
    filtered.forEach(product => {
      const div = document.createElement('div');
      const extraClass = filtered.length === 1 ? ' single-product' : '';
      div.className = 'product' + extraClass;
      
      // Contenido de la tarjeta del producto
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Marca: ${product.brand}</p>
        <p>Precio: $${product.price}</p>
        <p>Tallas: ${product.sizes ? product.sizes.join(", ") : "N/A"}</p>
        <p>Colores: ${product.colors ? product.colors.join(", ") : "N/A"}</p>
      `;
      // Al hacer clic en el producto se muestra el detalle
      div.addEventListener("click", function() {
        showProductDetails(product);
      });
      
      catalogDiv.appendChild(div);
    });
  }

  function renderFilterButtons() {
    // Obtener las marcas únicas
    const brands = Array.from(new Set(products.map(p => p.brand)));
    const allBrands = ['Todos', ...brands];
    filterButtonsContainer.innerHTML = '';
    allBrands.forEach(brand => {
      const btn = document.createElement('button');
      btn.textContent = brand;
      btn.addEventListener('click', () => {
        renderCatalog(brand);
      });
      filterButtonsContainer.appendChild(btn);
    });
  }

  renderFilterButtons();
  renderCatalog();

  // Función para mostrar el modal con el detalle del producto
  function showProductDetails(product) {
    const modal = document.getElementById("productModal");
    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalBrand = document.getElementById("modalBrand");
    const modalPrice = document.getElementById("modalPrice");
    const modalSizes = document.getElementById("modalSizes");
    const modalColors = document.getElementById("modalColors");

    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalBrand.textContent = "Marca: " + product.brand;
    modalPrice.textContent = "Precio: $" + product.price;
    modalSizes.textContent = "Tallas: " + (product.sizes ? product.sizes.join(", ") : "N/A");
    modalColors.textContent = "Colores: " + (product.colors ? product.colors.join(", ") : "N/A");

    modal.style.display = "block";
  }

  // Manejo del cierre del modal
  const modal = document.getElementById("productModal");
  const closeBtn = document.querySelector(".modal .close");
  closeBtn.onclick = function() {
    modal.style.display = "none";
  };
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
