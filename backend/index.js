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

const badgeSchema = new mongoose.Schema({
  value: String,
  // Agrega aquí otros campos que necesites
});

const imgSchema = new mongoose.Schema({
  value: String,
  // Agrega aquí otros campos que necesites
});

// Definir el esquema de datos
const dataSchema = new mongoose.Schema({
  img: [String],
  name: String,
  description: String,
  framework: String,
  getBadges: Object
});

// Crear un modelo basado en el esquema
const Data = mongoose.model('Data', dataSchema, 'state');

// Definir la ruta POST para guardar datos
app.post('/data', async (req, res) => {
  try {
    console.log(req.body)
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

// Iniciar el servidor
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});