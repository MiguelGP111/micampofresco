import express from 'express';
import CrearUsuarioRutas from './backend/vista/CrearUsuarioRutas.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/Usuario', CrearUsuarioRutas);

const PORT = process.env.PORT || 9696;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});