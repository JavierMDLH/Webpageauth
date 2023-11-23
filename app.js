const express = require('express');
const mysql = require('mysql');

const app = express();

// Configuración de la conexión a la base de datos RDS
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

// Ruta para el registro de usuarios
app.get('/register', (req, res) => {
  const { newUsername, newPassword, newEmail } = req.query;

  if (!newUsername || !newPassword || !newEmail) {
    res.status(400).send('Por favor, completa todos los campos');
    return;
  }

  // Verifica si el usuario ya existe en la base de datos
  const checkQuery = `SELECT * FROM users WHERE username='${newUsername}'`;
  connection.query(checkQuery, (err, results) => {
    if (err) {
      res.status(500).send(`Error de servidor al verificar usuario existente: ${err.message}`);
      return;
    }

    if (results.length > 0) {
      res.status(409).send('El usuario ya existe');
      return;
    }

    // Si el usuario no existe, procede con el registro
    const registerQuery = `INSERT INTO users (username, password, email) VALUES ('${newUsername}', '${newPassword}', '${newEmail}')`;
    connection.query(registerQuery, (err, results) => {
      if (err) {
        res.status(500).send(`Error de servidor al registrar usuario: ${err.message}`);
        return;
      }
      
      res.status(201).send('Usuario registrado exitosamente');
    });
  });
});


// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});


// Ruta para mostrar una página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
