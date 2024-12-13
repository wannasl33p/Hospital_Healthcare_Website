const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.db');


db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS appointments (name TEXT, number TEXT, date TEXT, time TEXT)");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index');
});


app.post('/add-record', (req, res) => {
  const { name, number, date, time } = req.body;
  db.run("INSERT INTO appointments (name, number, date, time) VALUES (?, ?, ?, ?)", [name, number, date, time], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Record added successfully");
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
