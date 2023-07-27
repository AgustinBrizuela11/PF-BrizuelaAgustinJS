async function obtenerProdutos(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

let carritoJSON = JSON.parse(localStorage.getItem("carrito"));
let carrito = carritoJSON ? carritoJSON : []

let botonFinalizarCompra = document.getElementById("terminarCompra")
botonFinalizarCompra.addEventListener("click", () => finalizarCompra(carrito))

obtenerProdutos('./json.json').then (data => renderizar(data))

function renderizar(arrayDeElementos) {
  const contenedor = document.getElementById("contenedor")
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
    botonAgregarAlCarrito.addEventListener("click", agregarAlCarrito)

  })
}
function agregarAlCarrito(e) {
  const id = parseInt(e.target.id)
  obtenerProdutos('./json.json').then (arrayDeElementos => {
  const productoBuscado = arrayDeElementos.find(producto => producto.id === id)
  const productoCarrito = carrito.findIndex(producto => producto.id === id)
  
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
  })
  
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
boton.addEventListener("click", () => filtrarYRenderizar(input.value))


function filtrarYRenderizar(valorFiltro) {
  obtenerProdutos('./json.json').then (arrayDeElementos => {
    let elementosFiltrados = arrayDeElementos.filter(elemento => elemento.nombre.toLowerCase().includes(valorFiltro.toLowerCase()))
    renderizar(elementosFiltrados)
  })

}

let botonesFiltros = document.getElementsByClassName("filtro")
for (const botonFiltro of botonesFiltros) {
  botonFiltro.addEventListener("click", filtrarYRenderizarPorCategoria)
}

function filtrarYRenderizarPorCategoria(e) {
  obtenerProdutos('./json.json').then (productos => {
    let elementosFiltrados = productos.filter(producto => producto.categoria === e.target.value)
    renderizar(elementosFiltrados)
  })
 
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