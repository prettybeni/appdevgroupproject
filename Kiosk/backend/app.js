const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const db = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:8080',  // Allow only the front-end to make requests
  credentials: true,  // Allow sending of credentials (cookies, authorization headers)
};
app.use(cookieParser()); // Add this line before your routes
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', routes);
app.options('/api/admin/products', cors());
app.use(express.urlencoded({ extended: true }));
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url} with data:`, req.body);
    next();
  });
  

  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack || err);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  });
  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
