const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recetario'
});

conexion.connect();

const receta = {
  nombre: 'Tortilla de patatas',
  ingredientes: 'Patatas, huevos, sal, aceite',
  pasos: '1. Pelar patatas. 2. Freír patatas. 3. Batir huevos y mezclar. 4. Cocinar en sartén.',
  tiempo_preparacion: 30,
  dificultad: 'fácil'
};

conexion.query('INSERT INTO recetas SET ?', receta, (err, result) => {
  if (err) console.log('❌ Error al insertar:', err);
  else console.log('✅ Receta insertada, ID:', result.insertId);
  conexion.end();
});
