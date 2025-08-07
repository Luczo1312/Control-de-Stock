// Obtener referencias a elementos HTML
const firstContainer = document.getElementById('firstContainer');
const titleDiv = document.getElementById('title');

// Función para renderizar la lista de productos en pantalla
function renderProducts(products){
    // Elimina todos los hijos de firstContainer excepto el primero (que es el título)
    while (firstContainer.children.length > 1) {
        firstContainer.removeChild(firstContainer.lastChild);
    }

    // Por cada producto, agregarlo al DOM usando addProduct
    products.forEach(product => {
        addProduct(product.id, product.name, product.stock);
    });
}

// Función para crear y agregar un producto al contenedor en el DOM
function addProduct(id, name, stock) {
    // Crear elementos HTML para mostrar el producto y botones
    const div = document.createElement('div');
    const p1 = document.createElement('p'); // Para el id
    const p2 = document.createElement('p'); // Para el nombre
    const p3 = document.createElement('p'); // Para el stock
    const button1 = document.createElement('button'); // Botón editar
    const button2 = document.createElement('button'); // Botón borrar

    // Asignar clases CSS para estilos
    div.className = 'gridContainer';
    p1.className = 'product';
    p2.className = 'product';
    p3.className = 'product';

    // Asignar texto a cada párrafo con los datos del producto
    p1.innerText = id;
    p2.innerText = name;
    p3.innerText = stock;

    // Configurar botones con texto y clases
    button1.className = 'buttonEdit';
    button2.className = 'buttonDelete';
    button1.innerText = 'Editar Producto';
    button2.innerText = 'Borrar Producto';

    // Asociar eventos click para editar y borrar producto
    button1.addEventListener('click', () => editProduct(id, name, stock));
    button2.addEventListener('click', () => deleteProduct(id));

    // Agregar los elementos creados al contenedor principal
    firstContainer.appendChild(div);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(button1);
    div.appendChild(button2);
}

// Función que maneja la creación de un nuevo producto a partir de inputs del formulario
function handleAddProduct() {
    const nameInput = document.getElementById('nameNewProduct');
    const stockInput = document.getElementById('stockNewProduct');

    // Obtener y limpiar valores ingresados por el usuario
    const name = nameInput.value.trim();
    const stock = parseInt(stockInput.value);

    // Validar nombre no vacío
    if (!name) {
        alert('El nombre no puede estar vacío');
        return;
    }

    // Validar que stock sea número válido y positivo
    if (isNaN(stock) || stock < 0) {
        alert('El stock debe ser un número válido');
        return;
    }

    // Enviar solicitud POST al backend para crear nuevo producto
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
        // Limpiar inputs y cerrar formulario
        nameInput.value = '';
        stockInput.value = '';
        toggleVisibility();
        cargarProductos(); // Recargar lista actualizada
    })
    .catch(err => {
        console.error(err);
        alert('No se pudo crear el producto');
    });
}

// Función para mostrar u ocultar el formulario de creación de producto
function toggleVisibility() {
    const buttonAdd = document.getElementById("createButton");
    const elemento = document.getElementById("productToAdd");

    if (elemento.style.display == "none") {
        elemento.style.display = "block";
        buttonAdd.innerText = "Cerrar Creacion de Producto";
    } else {
        elemento.style.display = "none";
        buttonAdd.innerText = "Crear Producto";
    }
}

// Función para editar un producto existente (pide datos nuevos con prompt)
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

    // Enviar PUT al backend con los nuevos datos
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
        cargarProductos(); // Actualizar lista
    })
    .catch(err => {
        console.error(err);
        alert('No se pudo actualizar el producto');
    });
}

// Función para eliminar un producto (pide confirmación antes)
function deleteProduct(id) {
    if (!confirm('¿Querés eliminar este producto?')) return;

    // Enviar DELETE al backend
    fetch(`/products/${id}`, { method: 'DELETE' })
    .then(res => {
        if (!res.ok) throw new Error('Error al eliminar producto');
        return res.json();
    })
    .then(() => {
        alert('Producto eliminado');
        cargarProductos(); // Actualizar lista
    })
    .catch(err => {
        console.error(err);
        alert('No se pudo eliminar el producto');
    });
}

// Función para obtener productos desde el backend y mostrarlos
function cargarProductos() {
    fetch('/products')
    .then(res => res.json())
    .then(products => renderProducts(products))
    .catch(err => console.error('Error al cargar productos:', err));
}

// Cuando el DOM está listo, cargar y mostrar los productos
window.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});
