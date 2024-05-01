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
app.use(express.json());

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
  data: {}
});
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

    // Inicializar data como un objeto vacío si no se proporciona ningún dato
    const userData = data ? data : {};

    // Crear un nuevo usuario y guardarlo en la base de datos
    const newUser = new User({ email, pass, data: userData });
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
    const userEmail = req.headers['email'];
    if (!userEmail) {
      return res.status(400).json({ error: 'No se proporcionó el correo electrónico' });
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { arrayName } = req.body;
    if (!arrayName) {
      return res.status(400).json({ error: 'No se proporcionó el nombre del array' });
    }

    console.log(arrayName);

    // Verificar si el array ya existe en el objeto `data`
    if (user.data.hasOwnProperty(arrayName)) {
      return res.status(400).json({ error: `El array "${arrayName}" ya existe` });
    }

    // Crear un nuevo objeto `data` con los datos anteriores y el nuevo array
    const newData = { ...user.data, [arrayName]: [] };

    // Actualizar el objeto `data` del usuario
    user.data = newData;

    await user.save();
    console.log(user);

    res.status(201).json({ message: `Nuevo array "${arrayName}" agregado correctamente` });
  } catch (error) {
    console.error('Error al agregar array:', error);
    res.status(500).json({ error: 'Error al agregar array' });
  }
});
// Ruta para obtener los datos del usuario
app.get('/api/user-data', async (req, res) => {
  try {
    const userEmail = req.headers['email'];
    if (!userEmail) {
      return res.status(400).json({ error: 'No se proporcionó el correo electrónico' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
});
app.post('/api/data/content-array', async (req, res) => {
  try {
    const userEmail = req.headers['email'];
    const userFramework = req.headers['framework'];
    if (!userEmail) {
      return res.status(400).json({ error: 'No se proporcionó el correo electrónico' });
    }

    // Verificar si el framework existe en el objeto `data`
    if (!req.body || !req.body.img || !req.body.name || !req.body.description || !req.body.getBadges || !req.body.getFramework || !req.body.idData) {
      return res.status(400).json({ error: 'Datos insuficientes para agregar contenido' });
    }
    // Actualizar el documento de usuario directamente en la base de datos
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { [`data.${userFramework}`]: req.body } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log(updatedUser.data[userFramework]);

    res.status(201).json({ message: `Contenido agregado correctamente al framework "${userFramework}"` });
  } catch (error) {
    console.error('Error al agregar contenido:', error);
    res.status(500).json({ error: 'Error al agregar contenido' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const userEmail = req.headers['email'];
    const userPass = req.headers['pass'];
    const userId = req.headers['id'];

    if (!userEmail || !userPass || !userId) {
      return res.status(400).json({ error: 'No se proporcionaron las credenciales necesarias' });
    }

    // Buscar el usuario en la base de datos usando las credenciales proporcionadas
    const user = await User.findOne({ email: userEmail, pass: userPass, _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver el usuario encontrado en la respuesta
    res.json(user);
  } catch (err) {
    console.error('Error al buscar el usuario:', err);
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});

app.put('/api/userdata', async (req, res) => {
  try {
    const userEmail = req.body['email'];
    const userPass = req.body['pass'];
    const userId = req.body['id'];
    const userIdData = req.body['iddata']
    const userName = req.body['name'];
    const userDescription = req.body['description'];
    const userFramework = req.body['framework'];
    const userOriginalFramework = req.body['originalFramework'];
    console.log(req.body)
    if (!userEmail || !userPass || !userId || !userIdData) {
      return res.status(400).json({ error: 'No se proporcionaron las credenciales necesarias' });
    }

    const user = await User.findOne({ email: userEmail, pass: userPass, _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscar el índice del elemento en el objeto original
    const objIndex = user.data[userOriginalFramework].findIndex(obj => obj.idData === userIdData);

    if (objIndex !== -1) {
      // Eliminar el elemento del objeto original
      const obj = user.data[userOriginalFramework].splice(objIndex, 1)[0];

      // Actualizar el objeto encontrado con los nuevos valores de name y description
      obj.name = userName;
      obj.description = userDescription;
      obj.getFramework = userFramework
      // Agregar el elemento al nuevo objeto
      user.data[userFramework].push(obj);

      // Marcar el subdocumento como modificado
      user.markModified(`data.${userOriginalFramework}`);
      user.markModified(`data.${userFramework}`);

      // Guardar los cambios en la base de datos
      await user.save();
      res.status(200).json({ message: 'Objeto actualizado y movido correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró ningún objeto con el iddata y framework proporcionados' });
    }

  } catch (err) {
    console.error('Error al buscar y actualizar el objeto:', err);
    res.status(500).json({ error: 'Error al buscar y actualizar el objeto' });
  }
});



// Iniciar el servidor
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
