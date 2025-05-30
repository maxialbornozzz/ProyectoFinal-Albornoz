function Producto(id, nombre, descripcion, precio, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.descripcion = descripcion;
  this.precio = precio;
  this.imagen = imagen;
}

let productos = [];
const productosContainer = document.getElementById("productos-container");

fetch("./data/productos.json")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    for (let i = 0; i < data.length; i++) {
      let prod = new Producto(
        data[i].id,
        data[i].nombre,
        data[i].descripcion,
        data[i].precio,
        data[i].imagen
      );
      productos.push(prod);
    }
    mostrarProductos();
  });

function mostrarProductos() {
  productosContainer.innerHTML = "";
  for (let i = 0; i < productos.length; i++) {
    const prod = productos[i];
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML =
      `<img src="${prod.imagen}" alt="${prod.nombre}">
       <h3>${prod.nombre}</h3>
       <p>${prod.descripcion}</p>
       <p><strong>$${prod.precio}</strong></p>
       <button data-id="${prod.id}">Agregar al carrito</button>`;
    const boton = div.querySelector("button");
    boton.addEventListener("click", function () {
      agregarAlCarrito(prod.id);
    });
    productosContainer.appendChild(div);
  }
}