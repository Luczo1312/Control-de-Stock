const firstContainer = document.getElementById('firstContainer');
const titleDiv = document.getElementById('title');


function renderProducts(products){
    // Elimina todo excepto el primer hijo (que es el título)
    while (firstContainer.children.length > 1) {
        firstContainer.removeChild(firstContainer.lastChild);
    }

    products.forEach(product => {
        addProduct(product.id, product.name, product.stock);
    });
}


function addProduct(id, name, stock) {
    const div = document.createElement('div');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');

    div.className = 'gridContainer'
    p1.className = 'product'
    p2.className = 'product'
    p3.className = 'product'
    p1.innerText = id
    p2.innerText = name
    p3.innerText = stock
    button1.className = 'buttonEdit'
    button2.className = 'buttonDelete'
    button1.innerText = 'Editar Producto'
    button2.innerText = 'Borrar Producto'
    button1.addEventListener('click', () => editProduct(id, name, stock));
    button2.addEventListener('click', () => deleteProduct(id));

    firstContainer.appendChild(div)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(button1)
    div.appendChild(button2)
}


function handleAddProduct() {
    const nameInput = document.getElementById('nameNewProduct');
    const stockInput = document.getElementById('stockNewProduct');

    const name = nameInput.value.trim();
    const stock = parseInt(stockInput.value);

    if (!name) {
        alert('El nombre no puede estar vacío');
        return;
    }

    if (isNaN(stock) || stock < 0) {
        alert('El stock debe ser un número válido');
        return;
    }

    // Enviar al backend
    fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stock })
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al crear producto');
        return res.json();
    })
    .then(data => {
        alert('Producto creado con éxito');
        nameInput.value = '';
        stockInput.value = '';
        toggleVisibility();      // Ocultar formulario
        cargarProductos();       // Recargar productos desde backend
    })
    .catch(err => {
        console.error(err);
        alert('No se pudo crear el producto');
    });
}



function toggleVisibility() {
    const buttonAdd = document.getElementById("createButton");
    const elemento = document.getElementById("productToAdd");
    if (elemento.style.display == "none") {
        elemento.style.display = "block";
        buttonAdd.innerText = "Cerrar Creacion de Producto"
    } else {
        elemento.style.display = "none";
        buttonAdd.innerText = "Crear Producto"
    }
}


function editProduct(id, currentName, currentStock) {
    const newName = prompt('Nuevo nombre:', currentName);
    if (newName === null) return; // Canceló

    const newStockStr = prompt('Nuevo stock:', currentStock);
    if (newStockStr === null) return; // Canceló

    const newStock = Number(newStockStr);
    if (isNaN(newStock) || newStock < 0) {
        alert('Stock inválido');
        return;
    }

    fetch(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, stock: newStock })
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al actualizar producto');
                return res.json();
        })
        .then(() => {
            alert('Producto actualizado');
            cargarProductos();
        })
        .catch(err => {
            console.error(err);
            alert('No se pudo actualizar el producto');
        });
}


function deleteProduct(id) {
    if (!confirm('¿Querés eliminar este producto?')) return;

    fetch(`/products/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar producto');
            return res.json();
        })
        .then(() => {
            alert('Producto eliminado');
            cargarProductos(); // Función que vuelve a cargar y renderizar productos
        })
        .catch(err => {
            console.error(err);
            alert('No se pudo eliminar el producto');
        });
}


function cargarProductos() {
    fetch('/products')
        .then(res => res.json())
        .then(products => renderProducts(products))
        .catch(err => console.error('Error al cargar productos:', err));
}

window.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});