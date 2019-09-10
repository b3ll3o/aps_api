const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect('mongodb://192.168.99.100:27017/aps', {
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

app.use('/create', async (req, res) => {
  try{
    const { latitude, longitude } = req.body;
    const incendio = await Incendio.create({ latitude, longitude });
    return res.send({ incendio });
  }catch(err){
    console.log(err);
    res.status(500).send({ error: 'Erro em criar novo foco de incendio'});
  }
});

app.use('/read', async (req, res) => {
  try{
    const incendios = await Incendio.find();
    return res.send({ incendios });
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em listar todos os pontos de incendio'});
  }
});

app.use('/readId/:id', async (req, res) => {
  try{
    const incendio = await Incendio.findById(req.params.id);
    return res.send({ incendio });
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em listar o ponto de incendio'});
  }
});

app.use('/update/:id', async (req, res) => {
  try{
    const { latitude, longitude } = req.body;
    const incendio = await Incendio
      .findByIdAndUpdate(req.params.id, { latitude, longitude }, { new: true });
    return res.send({ incendio });
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em atualizar ponto de incendio'});
  }
});

app.use('/delete/:id', async (req, res) => {
  try{
    await Incendio.findByIdAndRemove(req.params.id);
    return res.send();
  }catch(err){
    console.log(err);
    return res.status(500)
      .send({ error: 'Erro em deletar ponto de incendio'});
  }
});

app.listen(3100, () => console.log('Servidor rodando na porta 3100'));
