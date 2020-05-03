console.log('Server-side code running');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
//convert json to csv
const csvjson = require('csvjson');

const app = express();

// serve files from the public directory
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public');
});

//post per creare file
app.post('/clicked', (req, res) => {
  console.log('store data: ', req.body);
  let data = JSON.stringify(req.body.data, null, '\t');

  const csvData = csvjson.toCSV(req.body.data, {
    headers: 'key'
  });

  console.log("Change json data in csv: ", csvData);

  fs.writeFile(`results/${req.body.filename}.json`, data, error => {
    if (error) {
      console.log("An error occurred: ", error);
      res.sendStatus(500);
    } else {
      console.log('Your file is made!');

      fs.writeFile(`results/${req.body.filename}.csv`, csvData, error => {
        if (error) {
          console.log("An error occurred: ", error);
          res.sendStatus(500);
        } else {
          console.log('Your file is made!');
          res.sendStatus(201);
        }

      })
    }
  })
});