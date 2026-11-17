function actualizarPrecio() {
  const selectServicio = document.getElementById('servicioSelect');
  console.log(`Nuevo precio base: S/ ${selectServicio.value}`);
}

function calcularTotal() {
  const selectServicio = document.getElementById('servicioSelect');
  const inputCantidad = document.getElementById('cantidadInput');
  const modalCotizacion = document.getElementById('modal-cotizacion');

  const precioServicio = parseFloat(selectServicio.value);
  const nombreServicio = selectServicio.options[selectServicio.selectedIndex].text;
  const cantidad = parseInt(inputCantidad.value, 10);

  // Validación básica para evitar cantidades vacías o menores a 1
  if (!Number.isFinite(cantidad) || cantidad < 1) {
    alert("Por favor, ingresa una cantidad válida de personas (mínimo 1).");
    inputCantidad.focus();
    return;
  }

  const totalEstimado = precioServicio * cantidad;

  // Insertar los datos dinámicos en el modal
  document.getElementById('resumenServicio').textContent = nombreServicio;
  document.getElementById('resumenPersonas').textContent = cantidad === 1 ? "1 persona" : `${cantidad} personas`;
  document.getElementById('resumenTotal').textContent = `S/ ${totalEstimado.toFixed(2)}`;

  // Mostrar el modal usando tus mismas clases de la Sesión 14
  modalCotizacion.classList.add("is-visible");
  modalCotizacion.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Control de cierre para el modal de cotización
const modalCotizacion = document.getElementById("modal-cotizacion");

if (modalCotizacion) {
  const cerrarModalCotizacion = () => {
    modalCotizacion.classList.remove("is-visible");
    modalCotizacion.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  };

  // Cerrar al hacer clic en la X, el botón "Aceptar y cerrar" o el fondo oscuro
  modalCotizacion.addEventListener("click", (e) => {
    if (e.target.closest("[data-modal-close]")) {
      cerrarModalCotizacion();
    }
  });

  // Cerrar con la tecla Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalCotizacion.classList.contains("is-visible")) {
      cerrarModalCotizacion();
    }
  });
}

function saludar() {
  const inputNombre = document.getElementById('nombreInput');
  const textoSaludo = document.getElementById('chatSaludo');
  const nombre = inputNombre.value;

  console.log(`Nombre ingresado: ${nombre}`);
  textoSaludo.textContent = nombre === "" ? "¡Hola! Bienvenida a Mia Elegancia." : `¡Hola ${nombre}! Bienvenida a Mia Elegancia.`;
}

function elegirMetodo() {
  const selectPago = document.getElementById('metodoPago');
  console.log(`Método elegido: ${selectPago.value}`);
}

function verInstrucciones() {
  const selectPago = document.getElementById('metodoPago');
  const instrucciones = selectPago.value;
  alert(`Instrucciones de pago: ${instrucciones}`);
}

function pagarTarjeta() {
  const nombre = document.getElementById("tarjetaNombre").value.trim();
  const numero = document.getElementById("tarjetaNumero").value.trim();
  const vence = document.getElementById("tarjetaVence").value.trim();
  const cvv = document.getElementById("tarjetaCvv").value.trim();
  const monto = parseFloat(document.getElementById("tarjetaMonto").value);
  // Validar los campos
  if (
    nombre === "" ||
    numero === "" ||
    vence === "" ||
    cvv === "" ||
    !Number.isFinite(monto) ||
    monto <= 0
  ) {
    alert("Completa todos los campos e ingresa un monto válido.");
    return;
  }

  // --------- Semana 12: validación rigurosa con arreglo de errores ----------
  const errores = validarTarjeta(nombre, numero, vence, cvv);
  if (errores.length > 0) {
    console.table(errores); // se ve el arreglo de errores en DevTools
    let mensaje = "Revisa los siguientes datos:\n";
    for (const error of errores) {
      mensaje += `\n• ${error}`;
    }
    alert(mensaje);
    return;
  }
  // Confirmación de demostración
  alert(
    `¡Simulación completada!\n\n` +
    `Comercio: MIA SPA ELEGANCIA S.A.C.\n` +
    `Monto: S/ ${monto.toFixed(2)}\n\n` +
    `No se realizó ningún cobro ni se guardaron datos.`
  );
}

// --------- Semana 12: estructuras de control + arreglos + bucles ----------
// Revisa los datos de la tarjeta y devuelve un ARREGLO con todos los errores encontrados
// (si el arreglo queda vacío, los datos son correctos).
function validarTarjeta(nombre, numero, vence, cvv) {
  const errores = [];

  // Nombre: solo letras y espacios, mínimo 3 caracteres
  if (nombre.length < 3 || !/^[\p{L}\s.'-]+$/u.test(nombre)) {
    errores.push("El nombre debe tener al menos 3 letras (sin números).");
  }

  // Número: 16 dígitos (se ignoran los espacios) y solo Visa o Mastercard
  const digitos = numero.replace(/\s/g, "");
  if (isNaN(digitos) || digitos.length !== 16) {
    errores.push("El número de tarjeta debe tener 16 dígitos numéricos.");
  } else {
    switch (digitos[0]) {
      case "4": // Visa
        break;
      case "5": // Mastercard
      case "2": // Mastercard (serie 2)
        break;
      default:
        errores.push("Solo aceptamos tarjetas Visa o Mastercard.");
    }
  }

  // Vencimiento: formato MM/AA y que no esté vencida
  const partes = vence.split("/");
  const mes = parseInt(partes[0], 10);
  const anio = 2000 + parseInt(partes[1], 10);
  const hoy = new Date();
  if (partes.length !== 2 || !(mes >= 1 && mes <= 12) || isNaN(anio)) {
    errores.push("El vencimiento debe tener el formato MM/AA (ejemplo: 08/28).");
  } else if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
    errores.push("La tarjeta está vencida.");
  }

  // CVV: 3 o 4 dígitos numéricos
  if (isNaN(cvv) || cvv.length < 3 || cvv.length > 4) {
    errores.push("El CVV debe tener 3 o 4 dígitos.");
  }

  return errores;
}

// --------- Sesión 14 ----------
const menuBtn = document.querySelector(".hamburguesa");
const navMenu = document.querySelector(".nav");
const navBackdrop = document.querySelector(".nav-backdrop");

menuBtn.addEventListener("click", () => {
  const isActive = navMenu.classList.toggle("is-active");
  menuBtn.classList.toggle("is-active");
  navBackdrop.classList.toggle("is-active");
  menuBtn.setAttribute("aria-expanded", isActive);
  document.body.style.overflow = isActive ? "hidden" : "auto";
});

const cerrarMenu = () => {
  navMenu.classList.remove("is-active");
  menuBtn.classList.remove("is-active");
  navBackdrop.classList.remove("is-active");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "auto";
};

// Cerrar al elegir un enlace, al tocar el fondo oscuro o con la tecla Escape
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", cerrarMenu);
});
navBackdrop.addEventListener("click", cerrarMenu);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

// Si la ventana se agranda hasta el diseño de escritorio, cerrar el menú y devolver el scroll
window.addEventListener("resize", () => { if (window.innerWidth >= 768) cerrarMenu(); });

// CONTROL DEL MODAL DE PAGO CON TARJETA

const modalTarjeta = document.getElementById("pago-tarjeta");
const botonTarjeta = document.querySelector(
  '[data-modal-open="pago-tarjeta"]'
);

if (modalTarjeta && botonTarjeta) {

  // Abrir ventana modal
  const abrirModalTarjeta = () => {

    modalTarjeta.classList.add("is-visible");

    modalTarjeta.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.getElementById("tarjetaNombre").focus();

  };

  // Cerrar ventana modal
  const cerrarModalTarjeta = () => {

    modalTarjeta.classList.remove("is-visible");

    modalTarjeta.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "auto";

    botonTarjeta.focus();

  };

  // Evento para abrir
  botonTarjeta.addEventListener(
    "click",
    abrirModalTarjeta
  );

  // Evento para cerrar con X o fondo oscuro
  modalTarjeta.addEventListener("click", (e) => {

    if (e.target.closest("[data-modal-close]")) {
      cerrarModalTarjeta();
    }

  });

  // Cerrar con tecla Escape
  window.addEventListener("keydown", (e) => {

    if (
      e.key === "Escape" &&
      modalTarjeta.classList.contains("is-visible")
    ) {
      cerrarModalTarjeta();
    }

  });

} else {

  console.error(
    "No se encontró el botón o el modal de tarjeta."
  );

}

// --------- Semana 13: Manipulación del DOM (lista dinámica de servicios) ----------
const btnAgregarLista = document.querySelector("#btn-agregar-lista");
const listaItems = document.querySelector("#lista-items");
const listaVacia = document.querySelector("#lista-vacia");
const listaTotalFila = document.querySelector("#lista-total-fila");
const listaTotal = document.querySelector("#lista-total");
const listaContador = document.querySelector("#lista-contador");

if (btnAgregarLista && listaItems) {

  // Recalcula contador, total y mensaje de "lista vacía" leyendo el DOM actual
  const actualizarLista = () => {
    let total = 0;
    for (const item of listaItems.children) {
      if (!item.classList.contains("is-omitido")) {
        total += parseFloat(item.getAttribute("data-subtotal"));
      }
    }
    const cantidad = listaItems.children.length;
    listaContador.textContent = cantidad;
    listaTotal.textContent = `S/ ${total.toFixed(2)}`;
    listaVacia.hidden = cantidad > 0;
    listaTotalFila.hidden = cantidad === 0;
  };

  // Crea en memoria un <li> con sus botones y sus eventos
  const crearItemLista = (nombre, cantidad, subtotal) => {
    const item = document.createElement("li");
    item.className = "lista-item";
    item.setAttribute("data-subtotal", subtotal);

    const info = document.createElement("span");
    info.className = "lista-item-info";
    info.textContent = `${nombre} · ${cantidad === 1 ? "1 persona" : `${cantidad} personas`}`;

    const precio = document.createElement("strong");
    precio.className = "lista-item-precio";
    precio.textContent = `S/ ${subtotal.toFixed(2)}`;

    const btnOmitir = document.createElement("button");
    btnOmitir.type = "button";
    btnOmitir.className = "lista-btn";
    btnOmitir.textContent = "Omitir";
    btnOmitir.addEventListener("click", () => {
      const omitido = item.classList.toggle("is-omitido");
      btnOmitir.textContent = omitido ? "Incluir" : "Omitir";
      actualizarLista();
    });

    const btnQuitar = document.createElement("button");
    btnQuitar.type = "button";
    btnQuitar.className = "lista-btn lista-btn-quitar";
    btnQuitar.textContent = "Quitar";
    btnQuitar.setAttribute("aria-label", `Quitar ${nombre} de la lista`);
    btnQuitar.addEventListener("click", () => {
      item.remove();
      actualizarLista();
    });

    item.append(info, precio, btnOmitir, btnQuitar);
    return item;
  };

  btnAgregarLista.addEventListener("click", () => {
    const selectServicio = document.querySelector("#servicioSelect");
    const inputCantidad = document.querySelector("#cantidadInput");

    const precioServicio = parseFloat(selectServicio.value);
    const nombreServicio = selectServicio.options[selectServicio.selectedIndex].text;
    const cantidad = parseInt(inputCantidad.value, 10);

    if (!Number.isFinite(cantidad) || cantidad < 1) {
      alert("Por favor, ingresa una cantidad válida de personas (mínimo 1).");
      inputCantidad.focus();
      return;
    }

    listaItems.appendChild(crearItemLista(nombreServicio, cantidad, precioServicio * cantidad));
    actualizarLista();
  });

  actualizarLista();
}

// --------- Modo oscuro "Noche de spa" (agregado al final) ----------
// El botón está en index.html (al final del <body>) y aquí se coloca
// al comienzo del menú de opciones (.nav). Guarda la elección del usuario.
(function () {
  const CLAVE = "mia-modo-oscuro";
  const raiz = document.documentElement;
  const boton = document.getElementById("modo-toggle");
  const aviso = document.getElementById("modo-aviso");
  const menu = document.querySelector(".nav");
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (!boton || !menu) return;

  // Colocar el botón como PRIMERA opción del menú
  menu.prepend(boton);

  const icono = boton.querySelector("i");
  const texto = boton.querySelector(".modo-texto");
  let temporizador;

  const mostrarAviso = (mensaje) => {
    if (!aviso) return;
    aviso.textContent = mensaje;
    aviso.classList.add("is-visible");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => aviso.classList.remove("is-visible"), 2400);
  };

  const aplicarModo = (oscuro, conAviso) => {
    raiz.classList.add("cambiando-tema");
    raiz.classList.toggle("modo-oscuro", oscuro);
    boton.setAttribute("aria-pressed", oscuro);
    boton.setAttribute("aria-label", oscuro ? "Volver al modo día" : "Activar modo noche");
    icono.className = oscuro ? "fa-solid fa-sun" : "fa-solid fa-moon";
    texto.textContent = oscuro ? "Modo día" : "Modo noche";
    if (metaColor) metaColor.setAttribute("content", oscuro ? "#190c18" : "#ffffff");
    setTimeout(() => raiz.classList.remove("cambiando-tema"), 700);
    if (conAviso) {
      mostrarAviso(oscuro ? "🌙 Modo noche activado · respira y relájate" : "☀️ Modo día activado · bienvenida de nuevo");
    }
  };

  boton.addEventListener("click", () => {
    const oscuro = !raiz.classList.contains("modo-oscuro");
    aplicarModo(oscuro, true);
    try { localStorage.setItem(CLAVE, oscuro ? "1" : "0"); } catch (e) { /* sin almacenamiento */ }
  });

  // Recordar la elección anterior (por defecto la página se ve en modo día)
  let guardado = null;
  try { guardado = localStorage.getItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
  aplicarModo(guardado === "1", false);
})();
