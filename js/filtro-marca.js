// filtro-marca.js

function obtenerParametro(nombre) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombre);
}

document.addEventListener("DOMContentLoaded", () => {
  const marca = obtenerParametro("marca");
  const productos = document.querySelectorAll(".producto");

  if (marca) {
    productos.forEach(producto => {
      const marcaProducto = producto.getAttribute("data-marca");
      if (marcaProducto && marcaProducto.toLowerCase() === marca.toLowerCase()) {
        producto.style.display = "block";
      } else {
        producto.style.display = "none";
      }
    });
  }
});
