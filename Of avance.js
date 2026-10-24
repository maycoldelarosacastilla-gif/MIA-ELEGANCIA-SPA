function actualizarPrecio() {
  const selectServicio = document.getElementById('servicioSelect');
  console.log(`Nuevo precio base: S/ ${selectServicio.value}`);
}

function calcularTotal() {
  const selectServicio = document.getElementById('servicioSelect');
  const inputCantidad = document.getElementById('cantidadInput');

  const precioServicio = parseFloat(selectServicio.value);
  const cantidad = parseFloat(inputCantidad.value);
  const totalEstimado = precioServicio * cantidad;

  console.log(`Precio: S/ ${precioServicio} | Personas: ${cantidad} | Total: S/ ${totalEstimado}`);
  alert(`El total estimado es: S/ ${totalEstimado}`);
}

function saludar() {
  const inputNombre = document.getElementById('nombreInput');
  const textoSaludo = document.getElementById('chatSaludo');
  const nombre = inputNombre.value;

  console.log(`Nombre ingresado: ${nombre}`);
  textoSaludo.textContent = nombre === "" ? "¡Hola! Bienvenida a Mia Elegancia." : `¡Hola ${nombre}! Bienvenida a Mia Elegancia.`;
}
