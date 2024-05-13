
var pedidos = [];
var clienteEncontrado = [];
var productoEncontrado = [];
var nroPedido = 0;
var totalPedido = 0.00;
//fecha actual
const fechaDeHoy = new Date();

//defino por defecto la fecha actual obtenida
document.getElementById("fechaPedido").value = fechaDeHoy.toJSON().slice(0,10);

var listaPedidos = [];

const cliente = document.querySelector("#cliente");
const datosDelPedido = document.getElementById("datosDelPedido");
const fechaPedido = document.getElementById("fechaPedido");
const botonAgregar = document.getElementById("btnAgregar");

cargarPedidos();

document.querySelector(".formpedido").addEventListener("submit", function(e) {
    e.preventDefault();
});

botonAgregar.addEventListener("click", (e) => {
    addPedido();
});

function addPedido() {
    if (cliente.value === "" || datosDelPedido.value === "" || fechaPedido.value === "") {
        return;
    }
    if (datediff(fechaPedido.value) < 0) {
        return;
    }

    const nuevoPedido = {
        id: (Math.random() * 100).toString(36).slice(2),
        fecha: fechaPedido.value,
        cliente: cliente.value,
        pedido: datosDelPedido.value,
        realizado: false,
    };

    listaPedidos.unshift(nuevoPedido);

    guardarDatos(JSON.stringify(listaPedidos));

    cliente.value = "";
    datosDelPedido.value = "";

    renderPedidos();
}

function renderPedidos() {
    console.log('renderPedidos');

    const listaPedidosHTML = listaPedidos.map((event) => {
    return `
        <div class="pedidos">
            <div class="pedido-item fecha nodone">${event.fecha}</div>
            <div class="pedido-item nodone">${event.cliente}</div>
            <div class="pedido-item nodone">${event.pedido}</div>
            <div class="fechas nodone"><span class="dias-pedido">${datediff(event.fecha)}</span><span class="pedido-item"">días</span></div>
            <div class="actions"><button data-id="${event.id}" class="btnRealizado">Realizado</button></div>
            <div class="actions"><button data-id="${event.id}" class="btnEliminar">Eliminar</button></div>
        </div>`;
    });

    document.querySelector(".grillapedidos").innerHTML = listaPedidosHTML.join("");

    console.log(document.querySelector(".grillapedidos").innerHTML);

    document.querySelectorAll(".btnRealizado").forEach((event) => {
        event.addEventListener("click", (e) => {
            console.log("Boton Realizado");

            // recibo el elemento a borrar por parámetro
            const eliminar = (id) => {
                console.log(id);
                // busco su índice en el array
                let index = listaPedidos.indexOf(id)

                console.log(index);
                // si existe, o sea es distinto a -1, lo borro con splice
                if (index != -1 ) {
                    listaPedidos.splice(index, 1)
                } 
            }

            const id = event.getAttribute("data-id");
            eliminar(id);
            guardarDatos();
            renderPedidos();
        });
    });

    document.querySelectorAll(".btnEliminar").forEach((event) => {
        event.addEventListener("click", (e) => {
            console.log("Boton Eliminar");
            const id = event.getAttribute("data-id");
            console.log('antes filter ');
            console.log(listaPedidos);
            console.log(event.id);
            console.log('event.id '+event.id+' id '+id);
            listaPedidos = listaPedidos.filter(event => event.id !== id);
            console.log('despues filter ');
            console.log(listaPedidos);
            guardarDatos();
            renderPedidos();
        });
    });
}

function datediff(d) {
    var date1 = new Date(d);
    var date2 = new Date();
    var difference = date1.getTime() - date2.getTime();
    var days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
}

function cargarPedidos() {
    fetch('pedidos.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        listaPedidos = data;
        guardarDatos(JSON.stringify(listaPedidos));
        renderPedidos();
    })
    .catch(error => console.error('Error al cargar los pedidos del archivo JSON:', error));
}

function guardarDatos(data) {
    localStorage.setItem("items", data);
}

function leerDatos() {
    return JSON.parse(localStorage.getItem("items"));
}

function cartasDePedidos() {
    //cards con los pedidos
    //interactuar con campos de texto
    const campoCantidad = document.getElementById('cantidad');
    campoCantidad.value = listaPedidos.length;

    const articuloCartas = document.getElementById('cartas');
    articuloCartas.className = 'row container gap-3 mx-auto my-3'

    for (const pedido of listaPedidos){
        articuloCartas.innerHTML+=`
        <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${pedido.nombre}</h5>
            <p class="card-text">Precio: $ ${pedido.precio}</p>
            <button class="btn btn-primary">Comprar</button>
        </div>
        </div>
        `
    }
}