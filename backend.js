const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 3000; // Puerto a utilizar

app.use(bodyParser.json());
app.use(cors());
let serverInstance; 

// Ruta para insertar datos
app.post('/insertData', async (req, res) => {
    const { version, sfversion, message } = req.body;

    try {
        const connection = await oracledb.getConnection({
            user: 'DIP',
            password: 'luis12345',
            connectString: 'localhost:1521/XE' // Cambia esto por la cadena de conexión correcta
        });

        const sql = `INSERT INTO DIP.versiones (sfversion, version, message) VALUES (:sfversion, :version, :message)`;
        const binds = { version, sfversion, message };

        const result = await connection.execute(sql, binds, { autoCommit: true });
        await connection.close();

        console.log('Datos insertados en la base de datos:', result);

        res.json({ message: 'Datos insertados correctamente' });
    } catch (error) {
        console.error('Error al insertar datos en la base de datos:', error);
        res.status(500).json({ error: error.message });
    }
    
  
});
app.post('/closeBackend', (req, res) => {
  console.log('Received close request from frontend');
  serverInstance.close(() => {
    console.log('Backend server closed');
    process.exit(0); // Forzar cierre del proceso Node.js
  });
  res.json({ message: 'Backend closing' });
});
serverInstance = app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});


