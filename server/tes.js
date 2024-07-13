const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = 3001;
const { google } = require('googleapis');
const dotenv = require('dotenv');

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

//OAuth2 adalh jenis protokol Auth dimana kita tak harus menyimpan sandi pengguna
//code ini untuk inisilisasi klien auth dari google
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:5173/auth/google/callback');

//menyimpan toke dari google
//mendapatkan info pengguna
//periska data pengguna apa sudah masuk database MYSQL
//tujuan dari callback ini untuk menangani respon dari google setelah login
app.post('/auth/google/callback', async (req, res) => {
  const { token } = req.body;
  console.log('Received token:', token);
  oauth2Client.setCredentials({ access_token: token });

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  try {
    const { data } = await oauth2.userinfo.get();
    console.log('User info data:', data);

    if (!data) {
      return res.status(400).json({ message: 'Failed to retrieve user data' });
    }
    //bagian ambil email pengguna
    const email = data.email;
    const name = data.name;
    //bagian simpan ke database
    db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        db.query('INSERT INTO users (email, name) VALUES (?, ?)', [email, name], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
          }

          const userId = result.insertId;
          res.json({ isLoggedIn: true, userId, email, name });
        });
      } else {
        const userId = results[0].id;
        res.json({ isLoggedIn: true, userId, email, name });
      }
    });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
});

app.get('/auth/google', (req, res) => {
  res.redirect(authorizationUrl);
});
//periska apakah pengguna sudah login
//endpoint ini dibuat untuk memastika pengguna tidak bisa mengguna fitur utama jika belum login
app.get('/api/checkLogin', (req, res) => {
  const token = req.headers.authorization;

  oauth2Client
    .verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID })
    .then((ticket) => {
      const payload = ticket.getPayload();
      res.json({ isLoggedIn: true, user: payload });
    })
    .catch((err) => {
      res.json({ isLoggedIn: false });
    });
});

// app.post('/api/passwords', (req, res) => {
//   const { title, password, userId } = req.body; // assuming userId is sent in the body
//   const encryptedPassword = encrypt(password);

//   const query = 'INSERT INTO password (title, password, iv, user_id) VALUES (?, ?, ?, ?)';
//   const values = [title, encryptedPassword.password, encryptedPassword.iv, userId];

//   db.query(query, values, (err, results) => {
//     if (err) {
//       console.error('Error inserting password:', err);
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(201).json({ message: 'Password added successfully' });
//   });
// });

//memastika pengguna tidak bisa ngabil password user
app.get('/api/passwords', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log('Fetching passwords with token:', token);
  oauth2Client.setCredentials({ access_token: token });

  oauth2Client.getTokenInfo(token, (err, info) => {
    if (err) {
      console.error('Token validation error:', err);
      return res.status(401).json({ isLoggedIn: false });
    }

    const userId = info.user_id; // Assumes user_id is part of the token info
    console.log('User ID:', userId);

    db.query('SELECT * FROM password WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }

      console.log('Passwords fetched:', results);
      res.json(results);
    });
  });
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
