const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:5173/auth/google/callback');
const db = require('../config/database');

const googleCallback = async (req, res) => {
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

    db.query('SELECT google_user_id FROM users WHERE google_user_id = ?', [googleUserId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Results from SELECT query:', results);

      if (results.length === 0) {
        db.query('INSERT INTO users (google_user_id, email, name) VALUES (?, ?, ?)', [googleUserId, email, name], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
          }
          console.log('Inserted new user:', result);
          res.json({ isLoggedIn: true, googleUserId, email, name });
        });
      } else {
        const userId = googleUserId;
        res.json({ isLoggedIn: true, googleUserId: userId, email, name });
      }
    });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
};

const checkLogin = (req, res) => {
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
};

module.exports = { googleCallback, checkLogin };


