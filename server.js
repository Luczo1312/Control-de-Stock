const express = require('express');
const morgan = require('morgan');
const db =  require('./backend/database');
const cors = require('cors'); // para permitir peticiones desde tu HTML

const app = express();

app.use(morgan('dev'));
app.use(express.json()); // permite leer Json
app.use(cors());
app.use(express.static('public')); // si tenés el HTML en una carpeta "public"


app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al consultar productos' });
    }
    res.json(rows); // 👉 Enviar productos como JSON
  });
});

app.post('/products', (req, res) => {
  const { name, stock } = req.body;

  if (!name || stock == null) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const query = 'INSERT INTO products (name, stock) VALUES (?, ?)';
  db.run(query, [name, stock], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al agregar producto' });
    }

    res.status(201).json({ message: 'Producto creado', id: this.lastID });
  });
});



app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, stock } = req.body;

  if (!name || stock == null) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  db.run('UPDATE products SET name = ?, stock = ? WHERE id = ?', [name, stock, id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado' });
  });
});

app.delete('/products/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  });
});


// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor funcionando en http://localhost:3000');
});
