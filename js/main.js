let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const carritoCantidad = document.getElementById("carrito-cantidad");
const verCarritoBtn = document.getElementById("carrito");
const modal = document.getElementById("carritoModal");
const cerrarModal = document.getElementById("cerrar-modal");
const carritoItems = document.getElementById("carrito-items");
const total = document.getElementById("total");
const vaciarBtn = document.getElementById("vaciar-carrito");
const finalizarBtn = document.getElementById("finalizar-compra");
const formularioModal = document.getElementById("formulario");
const cerrarFormulario = document.getElementById("cerrar-formulario");
const formulario = document.getElementById("formulario-compra");

function agregarAlCarrito(id) {
  let producto = productos.find(function (p) {
    return p.id === id;
  });
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();
  Swal.fire({
    icon: "success",
    title: "Producto agregado",
    text: `${producto.nombre} fue agregado al carrito`,
    timer: 1000,
    showConfirmButton: false
  });
}

function actualizarCarritoUI() {
  carritoCantidad.textContent = carrito.length;
  carritoItems.innerHTML = "";
  let totalPrecio = 0;

  for (let item of carrito) {
    let div = document.createElement("div");
    div.innerHTML = `${item.nombre} - $${item.precio} <button onclick="eliminarItem(${carrito.indexOf(item)})">❌</button>`;
    carritoItems.appendChild(div);
    totalPrecio += item.precio;
  }

  total.textContent = `Total: $${totalPrecio}`;
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();
}

vaciarBtn.addEventListener("click", function () {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();
});

verCarritoBtn.addEventListener("click", function () {
  modal.style.display = "block";
  actualizarCarritoUI();
});

cerrarModal.addEventListener("click", function () {
  modal.style.display = "none";
});

finalizarBtn.addEventListener("click", function () {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "No podés finalizar la compra sin productos en el carrito.",
      confirmButtonText: "Entendido"
    });
  } else {
    modal.style.display = "none";
    formularioModal.style.display = "block";
  }
});

cerrarFormulario.addEventListener("click", function () {
  formularioModal.style.display = "none";
});

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  formularioModal.style.display = "none";
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarritoUI();
  Swal.fire("Compra realizada", "Gracias por tu compra, ya podés pasar a retirarlo por el local!", "success");
});

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  } else if (event.target === formularioModal) {
    formularioModal.style.display = "none";
  }
};

actualizarCarritoUI();