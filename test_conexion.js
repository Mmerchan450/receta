const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recetario'
});

conexion.connect(error => {
  if (error) {
    console.log('❌ Error de conexión:', error);
  } else {
    console.log('✅ Conectado a MySQL (recetario)');
  }
  conexion.end();
});
