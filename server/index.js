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
  port: 3307, //ini port xampp, sedangkan diatas port databse
});

//buat endpoint addpassword menangani permintaan pada URL http://localhost:3001/addpassword

app.post('/addpassword', (req, res) => {
  const { password, title } = req.body;
  const hashedPassword = encrypt(password);
  db.query('INSERT INTO passwords (password, title, iv) VALUES (?,?,?)', [hashedPassword.password, title, hashedPassword.iv], (err, result) => {
    // Jika ada kesalahan saat melakukan query, cetak kesalahan ke konsol
    //jika tidak maka cetak 'succes'
    if (err) {
      console.log(err);
    } else {
      res.send('Success');
    }
  });
});

app.listen(PORT, () => {
  console.log('Server is running');
});
