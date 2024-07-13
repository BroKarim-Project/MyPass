const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = 3001;
const { google } = require('googleapis');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const { encrypt, decrypt } = require('./src/utils/EncryptionHandler');

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
// app.post('/auth/google/callback', async (req, res) => {
//   const { token } = req.body;
//   console.log('Received token:', token);
//   oauth2Client.setCredentials({ access_token: token });

//   const oauth2 = google.oauth2({
//     auth: oauth2Client,
//     version: 'v2',
//   });

//   try {
//     const { data } = await oauth2.userinfo.get();
//     console.log('User info data:', data);

//     if (!data) {
//       return res.status(400).json({ message: 'Failed to retrieve user data' });
//     }
//     //bagian ambil email pengguna
//     const email = data.email;
//     const name = data.name;
//     const googleUserId = data.id;
//     //bagian simpan ke database
//     db.query('SELECT id FROM users WHERE google_user_id = ?', [googleUserId], (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: err.message });
//       }

//       if (results.length === 0) {
//         const userId = uuidv4(); // Generate a new UUID for the user
//         db.query('INSERT INTO users (id, email, name, google_user_id) VALUES (?, ?, ?, ?)', [userId, email, name, googleUserId], (err, result) => {
//           if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ error: err.message });
//           }

//           res.json({ isLoggedIn: true, userId, email, name });
//         });
//       } else {
//         const userId = results[0].user_id;
//         res.json({ isLoggedIn: true, userId, email, name });
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving user data:', error);
//     res.status(500).json({ error: 'Failed to retrieve user data' });
//   }
// });

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

    const email = data.email;
    const name = data.name;
    const googleUserId = data.id;

    // Query to check if the user already exists based on google_user_id
    db.query('SELECT google_user_id FROM users WHERE google_user_id = ?', [googleUserId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Results from SELECT query:', results);

      if (results.length === 0) {
        // User does not exist, so insert new user
        db.query('INSERT INTO users (google_user_id, email, name) VALUES (?, ?, ?)', [googleUserId, email, name], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
          }
          console.log('Inserted new user:', result);
          res.json({ isLoggedIn: true, googleUserId, email, name });
        });
      } else {
        // User exists
        const userId = googleUserId; // Use google_user_id as user identifier
        res.json({ isLoggedIn: true, googleUserId: userId, email, name });
      }
    });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
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

//verifikasi user
const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader); // Debugging authorization header

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token from header:', token); // Debugging token extraction

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);

    if (!response.ok) {
      throw new Error('Failed to verify token');
    }

    const payload = await response.json();
    console.log('Token payload:', payload); // Debugging token payload

    req.userId = payload.sub; // Google user ID
    console.log('User ID:', req.userId); // Logging user ID
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message); // Logging verification error
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.post('/addpassword', verifyUser, (req, res) => {
  const { password, title, google_user_id } = req.body;
  const hashedPassword = encrypt(password);

  db.query('INSERT INTO password (title, password, iv, google_user_id) VALUES (?, ?, ?, ?)', [title, hashedPassword.password, hashedPassword.iv, google_user_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    } else {
      res.send('Success');
    }
  });
});

app.get('/showpasswords', verifyUser, (req, res) => {
  const userId = req.userId; // ID Google User yang benar
  db.query('SELECT * FROM password WHERE google_user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching passwords:', err);
      return res.status(500).json({ error: 'Error fetching passwords' });
    }
    res.json(results);
  });
});

// app.post('/decryptpassword', verifyUser, (req, res) => {
//   const { id } = req.body;
//   const userId = req.userId;
//   db.query('SELECT * FROM password WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send('Error decrypting password');
//     } else if (result.length === 0) {
//       res.status(404).send('Password not found');
//     } else {
//       const decryptedPassword = decrypt(result[0]);
//       res.send(decryptedPassword);
//     }
//   });
// });

app.post('/decryptpassword', (req, res) => {
  try {
    const decryptedPassword = decrypt(req.body);
    res.send(decryptedPassword);
  } catch (error) {
    console.error('Error decrypting password:', error);
    res.status(500).json({ error: 'Error decrypting password' });
  }
});

app.listen(PORT, () => {
  console.log('Server is running');
});
