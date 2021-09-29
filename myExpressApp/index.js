const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')

const cors = require("cors");
const { all } = require('./app');
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

var mysql = require('mysql');
const Sequelize = require('sequelize');

const db = new Sequelize({
  // The `host` parameter is required for other databases
  host: 'localhost',
  dialect: 'sqlite',
  storage: './database.sqlite',
  database: 'todolist1'
});

// var db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'javascript5@A',
//   database: 'todolist1',
//   port: 3306
// });

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');
// });

const Note = db.define('items', { id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true,}, title: Sequelize.TEXT, isDone: Sequelize.BOOLEAN });
// db.sync({ force: true })
//   .then(() => {
//     console.log(`Database & tables created!`);

//     Note.bulkCreate([
//       { id:1, title: 'Complete JS course', isDone: true },
//       { id:2, title: 'Complete JS videos before that', isDone: false },
//     ]).then(function() {
//       return Note.findAll();
//     }).then(function(notes) {
//       console.log(notes);
//     });
//   });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.end('Hello World!');
});

app.get("/list_movies", (req, res) => {
  fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
    res.end(data);
  });
});

app.get('/get_items', (req, res) => {
  Note.findAll({order: [
    ['id', 'DESC']]}).then(notes => res.json(notes));
});

app.post('/post_item', (req, res) => {
  Note.create({ title: req.body.title, isDone: req.body.isDone }).then(function(note) {
    res.json(note);
  });
});

app.post('/remove_item', (req, res) => {
  Note.destroy({
    where: {
      id: req.body.id
    }
  });
});

app.post('/update_item', (req, res) => {
  Note.update(
    {isDone: true},
    {where: {id: req.body.id}}
  )
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});