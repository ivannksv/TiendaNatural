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
    ...productosYerba,
    ...productosTe,
    ...productosHebras,
    ...productosCafe,
    ...productosSuplementos, 
    ...productosGotas,
    ];

    // SLIDER
    const slider = document.querySelector('.slider');
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slides img');

    let index = 0;
    let startX = 0;
    let isDragging = false;

    function showSlide(i) {
        const total = images.length;
        index = (i + total) % total;
        slides.style.transform = `translateX(-${index * 100}vw)`;
    }

    let interval = setInterval(() => showSlide(index + 1), 5000);

    slider.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(interval);
    });

    slider.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
        showSlide(index + (deltaX > 0 ? -1 : 1));
        isDragging = false;
        interval = setInterval(() => showSlide(index + 1), 5000);
        }
    });

    slider.addEventListener('mousedown', e => {
        startX = e.clientX;
        isDragging = true;
        clearInterval(interval);
    });

    slider.addEventListener('mouseup', e => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 50) {
        showSlide(index + (deltaX > 0 ? -1 : 1));
        }
        isDragging = false;
        interval = setInterval(() => showSlide(index + 1), 5000);
    });

    const sliderPC = document.querySelector('.slider-pc');
    const imagesPC = document.querySelectorAll('.slider-pc img');
    let pcIndex = 0;

    function showPCSlide(i) {
    pcIndex = (i + imagesPC.length) % imagesPC.length;
    // Muestra 4 imágenes a la vez: oculta las otras
    imagesPC.forEach((img, idx) => {
        if (idx >= pcIndex && idx < pcIndex + 4) {
        img.style.display = 'block';
        } else {
        img.style.display = 'none';
        }
    });
    }

    showPCSlide(0);
    setInterval(() => {
    showPCSlide(pcIndex + 1);
    }, 4000);


    // MENÚ LATERAL
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', () => {
        const isActive = sideMenu.classList.contains('active');
        if (isActive) {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        } else {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        }
    });

    overlay.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        cerrarBuscador();
    });

    // BUSCADOR

    const searchToggle = document.getElementById('searchToggle');
    const searchModal = document.getElementById('searchModal');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalResultados = document.getElementById('modalResultados');
    const closeSearch = document.getElementById('closeSearch');

    searchToggle.addEventListener("click", abrirBuscador);
    closeSearch.addEventListener("click", cerrarBuscador);

    function abrirBuscador() {
        overlay.classList.add("active");
        searchModal.classList.add("active");
        modalSearchInput.focus();
    }

    function cerrarBuscador() {
        overlay.classList.remove("active");
        searchModal.classList.remove("active");
        modalSearchInput.value = "";
        modalResultados.innerHTML = "";
    }

    modalSearchInput.addEventListener("input", () => {
        const valor = normalizarTexto(modalSearchInput.value.trim());
        modalResultados.innerHTML = '';

        if (valor === '') return;

        const filtrados = productosData.filter(p =>
            normalizarTexto(p.nombre).includes(valor)
        );


        if (filtrados.length === 0) {
            modalResultados.innerHTML = `
                <p style="
                    color: white;
                    background-color: rgba(0, 0, 0, 0.6);
                    padding: 10px 15px;
                    border-radius: 6px;
                ">
                    No se encontraron productos.
                </p>`;
            return;
        }

        function normalizarTexto(texto) {
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        }

        filtrados.forEach(p => {
            const div = document.createElement('div');
            div.classList.add('resultado');

            // ✅ Arreglo de ruta de imagen
            let rutaImagen = p.imagen;
            if (rutaImagen.startsWith("../")) {
                rutaImagen = rutaImagen.replace("../", "");
            }

            div.innerHTML = `
                <img src="${rutaImagen}" alt="${p.nombre}">
                <h4>${p.nombre}</h4>
            `;

            div.addEventListener("click", () => {
                // ya no se usa normalizarNombre para categorizar, se usa p.categoria directamente
                let destino = "";

                switch (p.categoria) {
                case "yerba":
                    destino = "pages/yerba.html";
                    break;
                case "te":
                    destino = "pages/te.html";
                    break;
                case "hebras":
                    destino = "pages/hebras.html";
                    break;
                case "cafe":
                    destino = "pages/cafe.html";
                    break;
                case "suplementos":
                    destino = "pages/suplementos.html";
                    break;
                case "gotas":
                    destino = "pages/gotas.html";
                    break;
                default:
                    destino = "pages/"; // página fallback si se necesita
                }

                let url = destino;

                // Si el producto tiene marca, la pasamos como parámetro
                if (p.marca) {
                url += `?marca=${encodeURIComponent(p.marca)}`;
                }

                sessionStorage.setItem("scrollToID", p.id);

                window.location.href = url;



            });

            modalResultados.appendChild(div);
        });
    });




    // CARRITO
    const botonCarritoWsp = document.getElementById("boton-carrito-wsp");
    const carritoSidebar = document.getElementById("carrito-sidebar");
    const fondoOscuro = document.getElementById("fondo-oscuro");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalEl = document.getElementById("total");
    const enviarBtn = document.getElementById("enviar-pedido");

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
    
    // FORMATO DE NÚMEROS
    function formatearNumero(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // ACTUALIZA SIDEBAR Y CONTADOR
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

        const precioNum = Number(producto.precio.replace(/\./g, '').replace('$', '').replace(',', '.'));

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


    /*MODAL DATOS CLIENTE*/ 

    const datosClienteModal = document.getElementById("datos-cliente-modal");
    const nombreClienteInput = document.getElementById("nombre-cliente");
    const ciudadClienteInput = document.getElementById("ciudad-cliente");
    const calleClienteInput = document.getElementById("calle-cliente");
    const direccionClienteInput = document.getElementById("direccion-cliente");
    const confirmarDatosBtn = document.getElementById("confirmar-datos");

    enviarBtn.addEventListener("click", () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            alert("No hay productos para enviar.");
            return;
        }
        datosClienteModal.classList.add("active");
    });

    // ... y el resto sigue igual.


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

    actualizarContadorCarrito();

    const sideTab = document.getElementById('sideTab');
    sideTab.addEventListener('click', () => {
    const isActive = sideMenu.classList.contains('active');
    if (isActive) {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
    }
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

    // Boton desplegable delmenu sidebar
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.parentElement.classList.toggle('open');
    });
    });


});

