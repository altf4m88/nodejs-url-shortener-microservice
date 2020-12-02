require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortId = require('shortid');
const validUrl = require('valid-url');
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

app.post('/api/short/new', async (req, res) => {
  const url = req.body.url;
  const urlCode = shortId.generate();
  if(!validUrl.isWebUri(url)){
    res.status(401).json({
      error : 'INVALID URL'
    })
  } else {
    try{
      let findUrl = await URL.findOne({ original : url});

      if(findUrl){
        res.json({original : findUrl.original, shortened : findUrl.shortened});
      } else {
        findUrl = new URL({
          original : url,
          shortened : urlCode
        });
        await findUrl.save();
        res.json({original: findUrl.original, shortened : findUrl.shortened});
      }
    } catch(err){
      console.error(err);
      res.status(500).json('Server error...');
    }
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
