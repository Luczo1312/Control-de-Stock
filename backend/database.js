// Importar sqlite3 en modo verbose para obtener mensajes detallados
const sqlite3 = require('sqlite3').verbose();
// Importar módulo path para construir rutas de archivos de forma segura
const path = require('path');

// Construir la ruta absoluta hacia la base de datos 'inventario.db', ubicada una carpeta arriba del archivo actual
const dbPath = path.join(__dirname, '..', 'inventario.db');

// Crear o abrir la base de datos SQLite en la ruta especificada
const db = new sqlite3.Database(dbPath);

// Ejecutar una consulta para crear la tabla 'products' si no existe aún
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        stock INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// Exportar la conexión para usarla en otras partes del proyecto
module.exports = db;
