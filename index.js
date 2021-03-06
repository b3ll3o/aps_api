const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('dev'));

mongoose.connect('mongodb://b3ll3o:aps2019@ds011268.mlab.com:11268/aps_segundo_semestre', {
  useNewUrlParser: true ,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

const IncendioSchema = new mongoose.Schema({
  latitude: {
    type: mongoose.Decimal128,
    required: true
  },
  longitude: {
    type: mongoose.Decimal128,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Incendio = mongoose.model('Incendio', IncendioSchema);

app.post('/create', async (req, res) => {
  try{
    console.log(req.body);
    const { latitude, longitude } = req.body;
    const incendio = await Incendio.create({ latitude, longitude });
    return res.send(incendio);
  }catch(err){
    console.log(err);
    res.status(500).send({ error: 'Erro em criar novo foco de incendio'});
  }
});

app.get('/read', async (req, res) => {
  try{
    const incendios = await Incendio.find();
    return res.send(incendios);
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em listar todos os pontos de incendio'});
  }
});

app.get('/readId/:id', async (req, res) => {
  try{
    const incendio = await Incendio.findById(req.params.id);
    return res.send(incendio);
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em listar o ponto de incendio'});
  }
});

app.put('/update/:id', async (req, res) => {
  try{
    const { latitude, longitude } = req.body;
    const incendio = await Incendio
      .findByIdAndUpdate(req.params.id, { latitude, longitude }, { new: true });
    return res.send(incendio);
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em atualizar ponto de incendio'});
  }
});

app.delete('/delete/:id', async (req, res) => {
  try{
    await Incendio.findByIdAndRemove(req.params.id);
    return res.send();
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em deletar ponto de incendio'});
  }
});

app.listen(process.env.PORT || 3000 ,
  () => console.log(`Servidor rodando na porta ${process.env.PORT}`));
