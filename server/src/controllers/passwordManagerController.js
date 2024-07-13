const db = require('../config/database');
const { encrypt, decrypt } = require('../utils/EncryptionHandler');

const addPassword = (req, res) => {
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
};

const deletePassword = (req, res) => {
  const userId = req.userId;
  const passwordId = req.params.id; // Ambil passwordId dari URL params

  console.log('User ID:', userId);
  console.log('Password ID:', passwordId);

  db.query('DELETE FROM password WHERE id = ? AND google_user_id = ?', [passwordId, userId], (err, result) => {
    if (err) {
      console.log('Error deleting password:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      console.log('Password not found or not authorized to delete');
      return res.status(404).json({ error: 'Password not found or not authorized to delete' });
    }
console.log('Password deleted successfully');
    res.send({ message: 'Password deleted successfully' });
  });
};

const showPasswords = (req, res) => {
  const userId = req.userId;
  db.query('SELECT * FROM password WHERE google_user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching passwords:', err);
      return res.status(500).json({ error: 'Error fetching passwords' });
    }
    res.json(results);
  });
};

const decryptPassword = (req, res) => {
  try {
    const decryptedPassword = decrypt(req.body);
    res.send(decryptedPassword);
  } catch (error) {
    console.error('Error decrypting password:', error);
    res.status(500).json({ error: 'Error decrypting password' });
  }
};

module.exports = { addPassword, showPasswords, decryptPassword, deletePassword };
