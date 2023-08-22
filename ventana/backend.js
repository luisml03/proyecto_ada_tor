const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');
const { execSync } = require('child_process');


const app = express();
const PORT = 3000; // Puerto a utilizar

app.use(bodyParser.json());
app.use(cors());
let serverInstance; 
let insertDataSent = false;

const repoUrl = 'http://adacsc.co:1443/svn/repository/ADA/IMPLANTACION/TNS%20names%20actualizados/';
const logXml = execSync(`svn log -l 1 --xml "${repoUrl}"`).toString();
const commitId = logXml.match(/<logentry\s+revision="(\d+)"/)[1];
const commit_id = parseInt(commitId) + 1;


// Ruta para insertar datos
app.post('/insertData', async (req, res) => {
    const { version, sfversion, message, cbool } = req.body;
    
    try {
        const connection = await oracledb.getConnection({
          user: 'talento',             // Reemplaza por el nombre de usuario de tu base de datos
          password: 'talento',   // Reemplaza por la contraseña de tu base de datos
          connectString: '10.1.140.101:1521/db106'
        });
insertDataSent = true
        const sql = `INSERT INTO TALENTO.VERSIONES (commit_id, sfversion, version, message) VALUES (:commit_id, :sfversion, :version, :message)`;
        const binds = { commit_id, version, sfversion, message };

        const result = await connection.execute(sql, binds, { autoCommit: true });
        await connection.close();

        console.log('Datos insertados en la base de datos:', result);
        
        res.json({ message: 'datos insertados correctamente'});
      
    } catch (error) {
        console.error('Error al insertar datos en la base de datos:', error);
        res.status(500).json({ error: error.message });
    }
    
  
});


app.post('/closeBackend', (req, res) => {
  if (insertDataSent) {
  console.log('Received close request from frontend');
  
  serverInstance.close(() => {
    console.log('Backend server closed');
     process.exit(0); // Forzar cierre del proceso Node.js
   });
   
  res.json({ message: 'Backend closing' });
}else {
  console.error('Error al insertar datos en la base de datos:');
  res.status(500).json({ message: 'no data' });
  serverInstance.close(() => {
    console.log('Backend server closed');
     process.exit(1); // Forzar cierre del proceso Node.js
   });
   console.log('Se cancela el commit co ingresaste datos');
   console.error('Error al insertar datos en la base de datos:');
}
 
});
serverInstance = app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});



