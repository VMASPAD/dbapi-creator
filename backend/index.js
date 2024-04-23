// Importar los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear una aplicación de Express
const app = express();
const users = [];
// Configurar body-parser para analizar las solicitudes JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Habilitar CORS
app.use(cors());

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/dbapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Definir el esquema de datos para la colección de usuarios
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  pass: { type: String, required: true },
  data: []
});

// Crear un modelo basado en el esquema
const User = mongoose.model('User', userSchema);

// Definir la ruta POST para registrar un nuevo usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, pass, data } = req.body;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Crear un nuevo usuario y guardarlo en la base de datos
    const newUser = new User({ email, pass, data });
    await newUser.save();

    // Enviar los datos del usuario registrado como respuesta
    res.json(newUser);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Definir la ruta POST para iniciar sesión
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Buscar el usuario en la base de datos por correo electrónico y contraseña
    const user = await User.findOne({ email, pass });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Enviar los datos del usuario que inició sesión como respuesta
    res.json(user);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});
// Definir la ruta POST para agregar un nuevo array dentro de "data"
app.post('/api/data/add-array', async (req, res) => {
  try {
    const userEmail = req.headers['email']; // Obtener el correo electrónico del encabezado de la petición
    if (!userEmail) {
      return res.status(400).json({ error: 'No se proporcionó el correo electrónico' });
    }

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener el nombre del nuevo array desde los parámetros de la solicitud
    const { arrayName } = req.body;
    if (!arrayName) {
      return res.status(400).json({ error: 'No se proporcionó el nombre del array' });
    }

    // Agregar el nuevo array al objeto "data" del usuario
    user.data[arrayName] = [];
    await user.save();

    res.status(201).json({ message: `Nuevo array "${arrayName}" agregado correctamente` });
  } catch (error) {
    console.error('Error al agregar array:', error);
    res.status(500).json({ error: 'Error al agregar array' });
  }
});

// Iniciar el servidor
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
