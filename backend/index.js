// Importar los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear una aplicación de Express
const app = express();

// Configurar body-parser para analizar las solicitudes JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Habilitar CORS
app.use(cors());

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/state', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Definir el esquema de datos para las colecciones de usuarios
const userSchema = new mongoose.Schema({
  email: String
});

// Crear un modelo basado en el esquema
const User = mongoose.model('User', userSchema);
const dataSchema = new mongoose.Schema({
  img: [String],
  name: String,
  description: String,
  framework: String,
  getBadges: Object
});
// Definir la ruta POST para guardar datos
app.post('/data', async (req, res) => {
  try {
    const userEmail = req.headers['email']; // Obtener el correo electrónico del encabezado de la petición
    if (!userEmail) {
      return res.status(400).json({ error: 'No se proporcionó el correo electrónico' });
    }
    
    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      // Si el usuario no existe, crear uno nuevo
      user = await User.create({ email: userEmail });
    }

    // Crear una colección con el nombre del correo electrónico del usuario
    const collectionName = userEmail.replace('@', '_').replace('.', '_'); // Reemplazar caracteres especiales para el nombre de la colección
    const Data = mongoose.model(collectionName, dataSchema);

    // Agregar los datos recibidos al objeto "data" en la colección correspondiente
    const newData = await Data.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

// Definir la ruta GET para obtener todos los datos de la colección 'state'
app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});
// Definir la ruta GET para obtener todos los datos de una colección específica
app.get('/data/:collectionName', async (req, res) => {
  try {
    const collectionName = req.params.collectionName; // Obtener el nombre de la colección de los parámetros de la ruta
    const Data = mongoose.model(collectionName, dataSchema);

    // Buscar todos los datos en la colección específica
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// Iniciar el servidor
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
