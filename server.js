const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');
const fileRoutes = require('./routes/api/file-upload-routes')
const app = express(); 
const cors = require('cors');

// Connect Database;
connectDB();

// Init Middleware
//app.use(express.json({ extended: false }));
app.use(cors());

app.use(bodyParser.json())

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', fileRoutes.routes);


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //  Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  return console.log(`Server started on port ${PORT}`);
});
