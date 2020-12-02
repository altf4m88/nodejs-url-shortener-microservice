require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connection;
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB Connected")
});

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original: String,
  shortened: String
});
const URL = mongoose.model("URL", urlSchema);

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
