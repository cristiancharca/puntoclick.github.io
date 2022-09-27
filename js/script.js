const Clickbutton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

Clickbutton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem)
})


function addToCarritoItem(e) {
    const button = e.target
    const item = button.closest('.card')
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;

    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }

    addItemCarrito(newItem)
}


function addItemCarrito(newItem) {

    const alert = document.querySelector('.alert')

    setTimeout(function () {
        alert.classList.add('hide')
    }, 2000)
    alert.classList.remove('hide')

    const InputElemnto = tbody.getElementsByClassName('input__elemento')
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newItem.title.trim()) {
            carrito[i].cantidad++;
            const inputValue = InputElemnto[i]
            inputValue.value++;
            CarritoTotal()
            return null;
        }
    }

    carrito.push(newItem)
    renderCarrito()
}
function renderCarrito() {
    tbody.innerHTML = ''
    carrito.map(item => {
        const tr = document.createElement('tr')
        tr.classList.add('ItemCarrito')
        const Content = `
      
      <th scope="row">1</th>
              <td class="table__productos">
                <img src=${item.img}  alt="">
                <h6 class="title">${item.title}</h6>
              </td>
              <td class="table__price"><p>${item.precio}</p></td>
              <td class="table__cantidad">
                <input id="contador" type="number" min="1" value=${item.cantidad} class="input__elemento">
                <button id="botonx" class="delete btn btn-danger">x</button>
              </td>
      
      `
        tr.innerHTML = Content;
        tbody.append(tr)

        tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
        tr.querySelector(".input__elemento").addEventListener('change', sumarCantidad)
    })
    CarritoTotal()
}


function CarritoTotal() {
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("Bs.", ''))
        Total = Total + precio * item.cantidad
    })
    itemCartTotal.innerHTML = `Total Bs.${Total}`
    addLocalStorage()
}
function removeItemCarrito(e) {
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].title.trim() === title.trim()) {
            carrito.splice(i, 1)
        }
    }

    const alert = document.querySelector('.remove')

    setTimeout(function () {
        alert.classList.add('remove')
    }, 2000)
    alert.classList.remove('remove')

    tr.remove()
    CarritoTotal()
}

function sumarCantidad(e) {
    const sumaInput = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if (item.title.trim() === title) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            CarritoTotal()
            /* if(sumaInput.value < 1) {
                sumaInput = 1;
            } else {
                item.cantindad = sumaInput.value;
                carritoTotal();
            } */
        }
    })
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    storage && (carrito = storage);
    renderCarrito();
    /* if (storage) {
        carrito = storage;
        renderCarrito()
    } */
}


const btnpagar = document.querySelector('.botonpagar');


btnpagar.addEventListener('click', () => {
    Swal.fire({
        title: '¿Seguro que quiere Realizar la compra?',
        icon: 'warning',
        iconColor: '#DD3333',
        showCancelButton: true,
        confirmButtonColor: '#FFC107',
        cancelButtonColor: '#d33',
        background: '#130b06e0',
        color: '#FFFFFF',
        confirmButtonText: 'Si, Confirmar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Compra realizada, que lo disfrute!!',
            )
            tr = document.querySelectorAll("tr");
            carrito = [];
            tbody.innerHTML = '';
            CarritoTotal();
        }
    })/* 
    tr = document.querySelectorAll("tr");
    carrito = [];
    tbody.innerHTML = '';
    carritoTotal(); */
})

const btnenvio = document.querySelector('.botonenvio');
btnenvio.addEventListener('click', () => {
    Swal.fire({
        title: 'Su pedido va ser enviado, a la direccion que indica su usuario',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
        backdrop: `
      rgba(0,0,123,0.4)
      url("/img/envio.gif")
      left top
      no-repeat
    `
    })
})



const btnretirar = document.querySelector('.botonretirar');
btnretirar.addEventListener('click', () => {
    Swal.fire({
        title: 'Su pedido va ser preparado en nuestro local, muchas gracias.',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
        backdrop: `
      rgba(0,0,123,0.4)
      url("/img/retiro.gif")
      left top
      no-repeat
    `
    })
})

async function verificarEmail(emailsolicitante) {
    let API = ` https://www.disify.com/api/email/${emailsolicitante}`;
    const resp = await fetch(API);
    const dataJson = await resp.json();
    console.log(dataJson);
}

/* para entrega final api */

const cat_btn = document.getElementById('cat_btn');
const dog_btn = document.getElementById('dog_btn');
const cat_result = document.getElementById('cat_result');
const dog_result = document.getElementById('dog_result');

cat_btn.addEventListener('click', getRandomCat);
dog_btn.addEventListener('click', getRandomDog);

function getRandomCat() {
	fetch('https://aws.random.cat/meow')
		.then(res => res.json())
		.then(data => {
			cat_result.innerHTML = `<img src=${data.file} alt="cat" />`
		});
}

function getRandomDog() {
	fetch('https://random.dog/woof.json')
		.then(res => res.json())
		.then(data => {
			if(data.url.includes('.mp4')) {
				getRandomDog();
			}
			else {
				dog_result.innerHTML = `<img src=${data.url} alt="dog" />`;
			}
		});
}
