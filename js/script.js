document.addEventListener("DOMContentLoaded", () => {

  function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
    }

    const marcaSeleccionada = obtenerParametro('marca');

    if (marcaSeleccionada) {
        const productos = document.querySelectorAll('.producto');

        productos.forEach(producto => {
        const marca = producto.getAttribute('data-marca');

        if (marca && marca.toLowerCase() === marcaSeleccionada.toLowerCase()) {
            producto.style.display = '';
        } else {
            producto.style.display = 'none';
        }
        });
    }
  
  const productosData = [
  ...(typeof productosCafe !== 'undefined' ? productosCafe : []),
  ...(typeof productosHebras !== 'undefined' ? productosHebras : []),
  ...(typeof productosTe !== 'undefined' ? productosTe : []),
  ...(typeof productosYerba !== 'undefined' ? productosYerba : []),
  ...(typeof productosSuplementos !== 'undefined' ? productosSuplementos : []),
  ...(typeof productosGotas !== 'undefined' ? productosGotas : []),
  ];


    const productos = document.querySelectorAll(".producto");
    const botonesAgregar = document.querySelectorAll(".agregar-btn");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const modalInfo = document.getElementById("modal-info");
    const closeBtn = document.getElementById("closeModal");

    const botonCarritoWsp = document.getElementById("boton-carrito-wsp");
    const carritoSidebar = document.getElementById("carrito-sidebar");
    const fondoOscuro = document.getElementById("fondo-oscuro");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalEl = document.getElementById("total");
    const enviarBtn = document.getElementById("enviar-pedido");

    const datosClienteModal = document.getElementById("datos-cliente-modal");
    const nombreClienteInput = document.getElementById("nombre-cliente");
    const ciudadClienteInput = document.getElementById("ciudad-cliente");
    const calleClienteInput = document.getElementById("calle-cliente");
    const direccionClienteInput = document.getElementById("direccion-cliente");
    const confirmarDatosBtn = document.getElementById("confirmar-datos");

    // ✅ NUEVA FUNCIÓN: actualiza el número visible del carrito
    function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contadorElemento = document.getElementById("contador-carrito");

    const totalCantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

    if (contadorElemento) {
        if (totalCantidad > 0) {
        contadorElemento.textContent = totalCantidad;
        contadorElemento.style.display = "inline-block";
        } else {
        contadorElemento.style.display = "none";
        }
    }
    }
    

    function formatearNumero(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    productos.forEach((producto, i) => {
      producto.addEventListener("click", (e) => {
        if (e.target.classList.contains("agregar-btn")) return;
        const data = productosData[i];
        modalImg.src = data.imagen;
        modalTitle.textContent = data.nombre;
        modalPrice.textContent = data.precio;
        modalInfo.textContent = data.descripcion;
        modal.style.display = "flex";
      });
    });

    botonesAgregar.forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const producto = productosData[i];
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Agregar producto con cantidad 1 o incrementar si ya existe
        const index = carrito.findIndex(p => p.nombre === producto.nombre);
        if (index !== -1) {
          carrito[index].cantidad += 1;
        } else {
          carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`${producto.nombre} agregado al pedido`);
        actualizarSidebar();
      });
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Función para mostrar productos en el sidebar con cantidad, subtotal y botones
    function actualizarSidebar() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      listaCarrito.innerHTML = "";
      let total = 0;

      if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay productos en el pedido.</p>";
        totalEl.textContent = "Total: $0";
        actualizarContadorCarrito(); // ✅
        return;
      }

      carrito.forEach((producto, i) => {
        const div = document.createElement("div");
        div.classList.add("carrito-producto");

        // Extraemos precio numérico para cálculo
        let precioNum = 0;

        if (producto.precio && typeof producto.precio === 'string') {
          precioNum = Number(
            producto.precio.replace(/\./g, '').replace('$', '').replace(',', '.')
          );
        }


        div.innerHTML = `
          <p><strong>${producto.nombre}</strong></p>
          <p>Precio unitario: ${producto.precio}</p>
          <p>
            Cantidad: 
            <button class="menos" data-index="${i}">-</button>
            <span class="cantidad">${producto.cantidad}</span>
            <button class="mas" data-index="${i}">+</button>
          </p>
          <p>Subtotal: $${formatearNumero(precioNum * producto.cantidad)}</p>
          <button class="eliminar" data-index="${i}" style="background:#e74c3c; color:#fff; border:none; border-radius:4px; cursor:pointer; padding:2px 6px;">Eliminar</button>
        `;
        listaCarrito.appendChild(div);

        total += precioNum * producto.cantidad;
      });

      totalEl.textContent = `Total: $${formatearNumero(total)}`;
      actualizarContadorCarrito(); // ✅

      // Eventos para botones +, -, eliminar
      document.querySelectorAll(".mas").forEach(btn => {
        btn.onclick = () => {
          const idx = btn.getAttribute("data-index");
          const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          carrito[idx].cantidad += 1;
          localStorage.setItem("carrito", JSON.stringify(carrito));
          actualizarSidebar();
        };
      });

      document.querySelectorAll(".menos").forEach(btn => {
        btn.onclick = () => {
          const idx = btn.getAttribute("data-index");
          const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          if (carrito[idx].cantidad > 1) {
            carrito[idx].cantidad -= 1;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarSidebar();
          }
        };
      });

      document.querySelectorAll(".eliminar").forEach(btn => {
        btn.onclick = () => {
          const idx = btn.getAttribute("data-index");
          let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          carrito.splice(idx, 1);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          actualizarSidebar();
        };
      });
    }

    botonCarritoWsp.addEventListener("click", () => {
      carritoSidebar.classList.toggle("mostrar");
      fondoOscuro.classList.toggle("mostrar");
      actualizarSidebar();
    });

    fondoOscuro.addEventListener("click", () => {
      carritoSidebar.classList.remove("mostrar");
      fondoOscuro.classList.remove("mostrar");
    });

    enviarBtn.addEventListener("click", () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            alert("No hay productos para enviar.");
            return;
        }
        datosClienteModal.classList.add("active");
    });

    confirmarDatosBtn.addEventListener("click", () => {
        const nombre = nombreClienteInput.value.trim();
        const ciudad = ciudadClienteInput.value.trim();
        const calle = calleClienteInput.value.trim();
        const direccion = direccionClienteInput.value.trim();

        if (!nombre || !ciudad || !calle || !direccion) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        let mensaje = `*Pedido de ${nombre}*\n*Ciudad:* ${ciudad}\n*Dirección:* ${calle} ${direccion} \n\n*Productos:*\n`;

        carrito.forEach((prod, i) => {
            mensaje += `${i + 1}. ${prod.nombre} - Cantidad: ${prod.cantidad} - Precio unitario: ${prod.precio}\n`;
        });

        const total = carrito.reduce((acc, prod) => {
            const precioNum = Number(prod.precio.replace(/\./g, '').replace('$', '').replace(',', '.'));
            return acc + precioNum * prod.cantidad;
        }, 0);

        mensaje += `\n*Total:* $${formatearNumero(total)}`;

        const textoUrl = encodeURIComponent(mensaje);

        const telefono = "5491167186562"; // Cambiar al número deseado
        const url = `https://wa.me/${telefono}?text=${textoUrl}`;

        window.open(url, "_blank");

        datosClienteModal.classList.remove("active");
        nombreClienteInput.value = "";
        ciudadClienteInput.value = "";
        calleClienteInput.value = "";
        direccionClienteInput.value = "";

        carritoSidebar.classList.remove("mostrar");
        fondoOscuro.classList.remove("mostrar");
    });

    // Al hacer clic en el fondo oscuro, si el modal datos cliente está abierto, cerrarlo
    fondoOscuro.addEventListener("click", () => {
    if (datosClienteModal.classList.contains("active")) {
        datosClienteModal.classList.remove("active");
        // También cerrar carrito y fondo si están abiertos, para evitar conflictos
        carritoSidebar.classList.remove("mostrar");
        fondoOscuro.classList.remove("mostrar");
    }
    });

    actualizarSidebar();
  });
  
  
  document.querySelectorAll('.producto .precio').forEach(p => {
  const textoPrecio = p.textContent.trim();

  // Si contiene letras, lo marcamos como "AGOTADO"
  if (/[a-zA-Z]/.test(textoPrecio)) {
    p.innerHTML = `<span class="precio-agotado">${textoPrecio}</span>`;
    return;
  }

  let numero = textoPrecio.replace(/[^\d]/g, '');
  let precioNum = parseInt(numero, 10);

  if (!isNaN(precioNum)) {
    let precioAntes = Math.round(precioNum / 0.90);
    const formatearPrecio = n => '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    p.innerHTML = `
      <span class="precio-original">${formatearPrecio(precioAntes)}</span>
      <span class="precio-descuento">${textoPrecio}</span>
    `;
  }
});


  const modalImage = document.querySelector('.modal-content img');
  const fullscreenOverlay = document.createElement('div');
  fullscreenOverlay.className = 'fullscreen-img-overlay';

  const fullscreenImage = document.createElement('img');
  fullscreenOverlay.appendChild(fullscreenImage);

  const closeBtn = document.createElement('div');
  closeBtn.className = 'fullscreen-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.style.display = 'none';  // <-- Añade esta línea
  document.body.appendChild(fullscreenOverlay);
  document.body.appendChild(closeBtn);

  let scale = 1;
  let originX = 0;
  let originY = 0;
  let isDragging = false;
  let startX, startY;
  let currentX = 0;
  let currentY = 0;

  modalImage.addEventListener('click', () => {
    fullscreenImage.src = modalImage.src;
    fullscreenOverlay.classList.add('active');
    closeBtn.style.display = 'flex';
    scale = 1;
    currentX = 0;
    currentY = 0;
    updateTransform();
  });

  // Cerrar con el botón
  closeBtn.addEventListener('click', () => {
    fullscreenOverlay.classList.remove('active');
    closeBtn.style.display = 'none';
    resetTransform();
  });

  // Zoom con rueda mouse
  fullscreenOverlay.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale += delta;
    scale = Math.min(Math.max(1, scale), 5);
    updateTransform();
  });

  // Arrastrar la imagen (mouse)
  fullscreenOverlay.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    fullscreenOverlay.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    fullscreenOverlay.style.cursor = 'grab';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    updateTransform();
  });

  // Función para actualizar transformaciones CSS
  function updateTransform() {
    fullscreenImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
  }

  // Reset transform al cerrar
  function resetTransform() {
    scale = 1;
    currentX = 0;
    currentY = 0;
    updateTransform();
  }

 window.addEventListener("load", () => {
    const savedID = sessionStorage.getItem("scrollToID");

    if (savedID) {
        const target = document.getElementById(savedID);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                window.scrollBy(0, -80); // si tenés menú fijo
                target.style.outline = "3px solid #014d1a";
                setTimeout(() => {
                    target.style.outline = "";
                }, 2000);
                sessionStorage.removeItem("scrollToID"); // limpiar
            }, 200); // esperar que cargue bien
        }
    }
});

window.addEventListener("resize", () => {
  document.body.style.height = window.innerHeight + "px";
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  





