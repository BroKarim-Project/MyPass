const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const authRoutes = require('./routes/authRoutes');
const passwordManagerRoutes = require('./routes/passwordManagerRoutes');
const db = require('./config/database');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/passwords', passwordManagerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
