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
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'javascript5@A',
  database: 'todolist1',
  port: 3306
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});

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
  db.query('SELECT * FROM items ORDER BY id DESC', (err, rows) => {
    if (err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
    res.end(JSON.stringify(rows));
  });
});

app.post("/post_item", (req, res, config) => {
  var sql = 'INSERT INTO items SET ?';
  const newItem = req.body;
  console.log("UserDetails", newItem);
  db.query(sql, newItem, (err, rows, fields) => {
    if (!err) {
        res.send(rows);
        // res.end(JSON.stringify("success", res));
    } else {
        console.log(err.message);
        res.send(err);
        // res.end(JSON.stringify(err.message));
        
    }
})
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});