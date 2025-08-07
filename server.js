// Importar dependencias necesarias
const express = require('express');
const morgan = require('morgan'); // Logger HTTP para mostrar solicitudes en consola
const db =  require('./backend/database'); // Conexión a la base de datos SQLite
const cors = require('cors'); // Middleware para permitir peticiones CORS desde el frontend

const app = express(); // Crear la aplicación Express

// Middleware
app.use(morgan('dev')); // Mostrar logs de las peticiones en consola (modo desarrollo)
app.use(express.json()); // Permite parsear JSON en el cuerpo de las peticiones
app.use(cors()); // Habilitar CORS para permitir peticiones desde otras fuentes (ej. frontend)
app.use(express.static('public')); // Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"

// Rutas de la API

// Obtener todos los productos
app.get('/products', (req, res) => {
  // Consultar todos los productos en la base de datos
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err);
      // Enviar error 500 si hubo problema en la consulta
      return res.status(500).json({ error: 'Error al consultar productos' });
    }
    // Enviar lista de productos como JSON
    res.json(rows);
  });
});

// Crear un nuevo producto
app.post('/products', (req, res) => {
  const { name, stock } = req.body;

  // Validar que se envíen ambos campos
  if (!name || stock == null) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Insertar nuevo producto en la base de datos
  const query = 'INSERT INTO products (name, stock) VALUES (?, ?)';
  db.run(query, [name, stock], function(err) {
    if (err) {
      console.error(err);
      // Error al insertar producto
      return res.status(500).json({ error: 'Error al agregar producto' });
    }

    // Responder con éxito y el ID generado del nuevo producto
    res.status(201).json({ message: 'Producto creado', id: this.lastID });
  });
});

// Actualizar un producto existente
app.put('/products/:id', (req, res) => {
  const id = req.params.id; // Obtener ID desde la URL
  const { name, stock } = req.body;

  // Validar campos requeridos
  if (!name || stock == null) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Ejecutar actualización en la base de datos
  db.run('UPDATE products SET name = ?, stock = ? WHERE id = ?', [name, stock, id], function (err) {
    if (err) {
      console.error(err);
      // Error al actualizar producto
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }

    // Si no se afectó ninguna fila, el producto no existe
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Confirmar actualización exitosa
    res.json({ message: 'Producto actualizado' });
  });
});

// Eliminar un producto por ID
app.delete('/products/:id', (req, res) => {
  const id = req.params.id;

  // Ejecutar eliminación en la base de datos
  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      // Error al eliminar producto
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    // Si no se afectó ninguna fila, el producto no existe
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Confirmar eliminación exitosa
    res.json({ message: 'Producto eliminado' });
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor funcionando en http://localhost:3000');
});
