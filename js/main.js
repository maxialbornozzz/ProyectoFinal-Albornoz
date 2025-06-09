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
  let producto = null;
  for (let p of productos) {
    if (p.id === id) {
      producto = p;
      break;
    }
  }

  let encontrado = false;
  for (let item of carrito) {
    if (item.id === id) {
      item.cantidad++;
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    const nuevoProducto = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    };
    carrito.push(nuevoProducto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();

  Swal.fire({
    icon: "success",
    title: "Producto agregado",
    text: producto.nombre + " fue agregado al carrito",
    timer: 1000,
    showConfirmButton: false
  });
}

function actualizarCarritoUI() {
  let totalUnidades = 0;
  for (let item of carrito) {
    totalUnidades += item.cantidad;
  }
  carritoCantidad.textContent = totalUnidades;

  carritoItems.innerHTML = "";
  let totalPrecio = 0;

  for (let item of carrito) {
    let div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = item.nombre + " - $" + item.precio + " x " +
      '<button class="btn-restar" data-id="' + item.id + '">-</button>' +
      item.cantidad +
      '<button class="btn-sumar" data-id="' + item.id + '">+</button>' +
      '<button class="btn-eliminar" data-id="' + item.id + '">❌</button>';

    carritoItems.appendChild(div);
    totalPrecio += item.precio * item.cantidad;

    div.querySelector(".btn-restar").addEventListener("click", function() {
      if (item.cantidad > 1) {
        item.cantidad--;
      } else {
        carrito = carrito.filter(function(producto) {
          return producto.id !== item.id;
        });
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarritoUI();
    });

    div.querySelector(".btn-sumar").addEventListener("click", function() {
      item.cantidad++;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarritoUI();
    });

    div.querySelector(".btn-eliminar").addEventListener("click", function() {
      carrito = carrito.filter(function(producto) {
        return producto.id !== item.id;
      });
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarritoUI();
    });
  }

  total.textContent = "Total: $" + totalPrecio;
}

vaciarBtn.addEventListener("click", function() {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();
});

verCarritoBtn.addEventListener("click", function() {
  modal.style.display = "block";
  actualizarCarritoUI();
});

cerrarModal.addEventListener("click", function() {
  modal.style.display = "none";
});

finalizarBtn.addEventListener("click", function() {
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

cerrarFormulario.addEventListener("click", function() {
  formularioModal.style.display = "none";
});

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = formulario.querySelector('input[placeholder="Nombre"]').value;
  let apellido = formulario.querySelector('input[placeholder="Apellido"]').value;
  let dni = formulario.querySelector('input[placeholder="DNI"]').value;
  let tarjeta = formulario.querySelector('input[placeholder="Tarjeta de credito/debito"]').value;
  let cvv = formulario.querySelector('input[placeholder="CVV/CVC"]').value;

  if (/\d/.test(nombre)) {
    Swal.fire("Error", "El nombre no puede contener números", "error");
    return;
  }

  if (/\d/.test(apellido)) {
    Swal.fire("Error", "El apellido no puede contener números", "error");
    return;
  }

  if (dni.length > 8 || isNaN(dni)) {
    Swal.fire("Error", "El DNI debe tener hasta 8 números como máximo", "error");
    return;
  }

  if (tarjeta.length !== 16 || isNaN(tarjeta)) {
    Swal.fire("Error", "La tarjeta debe tener 16 dígitos numéricos", "error");
    return;
  }

  if (cvv.length !== 3 || isNaN(cvv)) {
    Swal.fire("Error", "El CVV debe tener 3 dígitos", "error");
    return;
  }

  let resumenHTML = '<h3>¡Gracias por tu compra, ' + nombre + '<p>Recibirás un correo de confirmación</p>' + '<h4>Resumen:</h4><ul>';

  for (let item of carrito) {
    resumenHTML += '<li>' + item.nombre + ' - $' + item.precio + ' x ' + item.cantidad + ' = $' + (item.precio * item.cantidad) + '</li>';
  }

  let totalCompra = 0;
  for (let item of carrito) {
    totalCompra += item.precio * item.cantidad;
  }

  resumenHTML += '</ul><p><strong>Total: $' + totalCompra + '</strong></p>' + '<p>Retiro en tienda: San Justo, Entre Ríos 5600</p>';

  Swal.fire({
    title: "Compra exitosa",
    html: resumenHTML,
    icon: "success",
    confirmButtonText: "Aceptar"
  });

  formularioModal.style.display = "none";
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarritoUI();
});

modal.addEventListener("click", function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

formularioModal.addEventListener("click", function(e) {
  if (e.target === formularioModal) {
    formularioModal.style.display = "none";
  }
});

actualizarCarritoUI();

