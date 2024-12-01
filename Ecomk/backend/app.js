const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const user = require('./controller/userControl');
const db = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');



const app = express();
const PORT = process.env.PORT || 5000;


app.use(session({
  secret: 'your-secret-key', // Replace with your secret key
  resave: false,             // Don't resave the session if it hasn't been modified
  saveUninitialized: true,   // Save the session even if it's new, but unmodified
  cookie: {
    httpOnly: true, // Prevent access to cookie via JavaScript
    secure: false, // If you're not using HTTPS, set to false
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days expiration
}  // Set to `true` if using HTTPS
}));
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
