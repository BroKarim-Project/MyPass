const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = 3001;

const { encrypt, decrypt } = require('./EncryptionHandler');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'passwordmanager',
});
//decide to use mysql workbench than xampp, so i check the connection first
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.post('/addpassword', (req, res) => {
  const { password, title } = req.body;
  const hashedPassword = encrypt(password);
  db.query('INSERT INTO password (title, password, iv) VALUES (?,?,?)', [title, hashedPassword.password, hashedPassword.iv], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Success');
    }
  });
});

app.get('/showpasswords', (req, res) => {
  db.query('SELECT * FROM password;', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/decryptpassword', (req, res) => {
  res.send(decrypt(req.body));
  console.log('Request body:', req.body);
});

app.listen(PORT, () => {
  console.log('Server is running');
});
