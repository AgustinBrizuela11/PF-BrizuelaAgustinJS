function programaPricipal() {

  let productos = [  
    { id: 2, nombre: "Iphone 12", categoria: "telefono", precio: 600, stock: 3, rutaImagen: "iphone12.jpg" },
    { id: 3, nombre: "Iphone 13", categoria: "telefono", precio: 760, stock: 10, rutaImagen: "iphone13.jpg" },
    { id: 5, nombre: "Iphone 14", categoria: "telefono", precio: 850, stock: 10, rutaImagen: "iphone14.jpg" },
    { id: 7, nombre: "Iphone 14 Pro", categoria: "telefono", precio: 950, stock: 10, rutaImagen: "iphone14pro.jpg" },
    { id: 9, nombre: "Funda (todos los modelos)", categoria: "accesorio", precio: 10, stock: 10, rutaImagen: "funda.jpg" },
    { id: 12, nombre: "Protector vidrio templado", categoria: "accesorio", precio: 5, stock: 10, rutaImagen: "protector.jpg" },
  ]
console.log(productos)

/* 
 let productos = []
 const urlLocal = './json.json'
 fetch(urlLocal)
  .then(response => response.json())
  .then(data =>{
    productos = data.productos
    console.log(productos)
  }
  )
  */
let carritoJSON = JSON.parse(localStorage.getItem("carrito"));
let carrito = carritoJSON ? carritoJSON : []
let contenedor = document.getElementById("contenedor")

renderizar(productos, contenedor, carrito)
renderizarCarrito(carrito)

let botonFinalizarCompra = document.getElementById("terminarCompra")
botonFinalizarCompra.addEventListener("click", () => finalizarCompra(carrito))

}

programaPricipal()

function renderizar(arrayDeElementos, contenedor, carrito) {

  contenedor.innerHTML = ""
  arrayDeElementos.forEach(producto => {
    let mensaje = "Unidades " + producto.stock

    let tarjetaProducto = document.createElement("div")
    if (producto.stock < 3) {
      mensaje = "Últimas unidades"
    }
    tarjetaProducto.classList.add("tarjetaProducto")
    tarjetaProducto.innerHTML = `
    <h2>${producto.nombre}</h2>
    <div class=imagen style="background-image: url(./images/${producto.rutaImagen})"></div>
    <p>$${producto.precio}</p>
    <p>${mensaje}</p>
    <button id=${producto.id}>Agregar al carrito</button>
  `
    contenedor.appendChild(tarjetaProducto)
    let botonAgregarAlCarrito = document.getElementById(producto.id)
    botonAgregarAlCarrito.addEventListener("click", () => agregarAlCarrito(arrayDeElementos, producto.id, carrito))

  })
}

function agregarAlCarrito(arrayDeElementos, id, carrito) {
  
  let productoBuscado = arrayDeElementos.find(producto => producto.id === id)
  let productoCarrito = carrito.findIndex(producto => producto.id === id)
  
  if (productoCarrito !== -1) {
    carrito[productoCarrito].unidad++
    carrito[productoCarrito].subtotal = carrito[productoCarrito].unidad * carrito[productoCarrito].precioUni
  }else{
    carrito.push({
      id: productoBuscado.id,
      nombre: productoBuscado.nombre,
      precioUni: productoBuscado.precio,
      unidad: 1,
      subtotal: productoBuscado.precio
    })
  }
  lanzarTosti()
  localStorage.setItem("carrito", JSON.stringify(carrito))
  renderizarCarrito(carrito)
}

function renderizarCarrito(carritoJSON) {
  let carritoFisico = document.getElementById("carrito")
  carritoFisico.innerHTML= ""
  carritoJSON.forEach(producto => {
    carritoFisico.innerHTML += `<p>${producto.nombre} ${producto.precioUni} ${producto.unidad} ${producto.subtotal}</p>\n`
  })
}

function finalizarCompra(carrito) {
  let carritoFisico = document.getElementById("carrito")
  carritoFisico.innerHTML = ""
  localStorage.removeItem("carrito")
  carrito = []
  lanzarAlert()
}

let botonCarrito = document.getElementById("botonCarrito")
botonCarrito.addEventListener("click", mostrarOcultar)

function mostrarOcultar() {
  let padreContenedor = document.getElementById("productos")
  let carrito = document.getElementById("contenedorCarrito")
  padreContenedor.classList.toggle("oculto")
  carrito.classList.toggle("oculto")
}

let input = document.getElementById("miInput")
let boton = document.getElementById("miBoton")
boton.addEventListener("click", () => filtrarYRenderizar(productos, input.value))


function filtrarYRenderizar(arrayDeElementos, valorFiltro) {
  let elementosFiltrados = arrayDeElementos.filter(elemento => elemento.nombre.toLowerCase().includes(valorFiltro.toLowerCase()))
  renderizar(elementosFiltrados)
}

let botonesFiltros = document.getElementsByClassName("filtro")
for (const botonFiltro of botonesFiltros) {
  botonFiltro.addEventListener("click", filtrarYRenderizarPorCategoria)
}

function filtrarYRenderizarPorCategoria(e) {
  let elementosFiltrados = productos.filter(producto => producto.categoria === e.target.value)
  renderizar(elementosFiltrados)
}

function lanzarAlert() {
  Swal.fire({
    title: 'Haz finalizado la compra',
    icon: 'success',
    confirmButtonText: 'Cool',
    duration: 3000
  })
}

function lanzarTosti() {
  Toastify({
    text: "Producto agregado al carrito",
    className: "info",
    duration: 2000
  }).showToast();
}