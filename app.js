const express = require('express');
const mysql = require('mysql');

const app = express();

// Configura la conexión a la base de datos RDS
const connection = mysql.createConnection({
  host: 'database-2.cueyooy1kuvm.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'javiermercado',
  database: 'prueba',
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos RDS');
});

// Ruta para manejar la autenticación
app.get('/login', (req, res) => {
  const { username, password } = req.query;

  // Verifica las credenciales en la base de datos
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error de servidor');
      return;
    }
    
    if (results.length > 0) {
      res.status(200).send('Inicio de sesión exitoso');
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
