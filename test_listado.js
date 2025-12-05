const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recetario'
});

conexion.connect();

conexion.query('SELECT * FROM recetas ORDER BY codigo DESC', (err, filas) => {
  if (err) console.log('❌ Error en listado:', err);
  else {
    console.log('✅ Recetas encontradas:', filas.length);
    filas.forEach(f => {
      console.log(f.codigo, f.nombre, f.tiempo_preparacion + ' min', f.dificultad);
    });
  }
  conexion.end();
});
