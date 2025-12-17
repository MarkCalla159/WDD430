var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var index = require('./server/routes/app');
const bookRoutes = require('./server/routes/books');
const messageRoutes = require('./server/routes/messages');
const authorRoutes = require('./server/routes/authors');

// =======================
// CREATE EXPRESS APP
// =======================
var app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

// =======================
// CORS SUPPORT
// =======================
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

// =======================
// STATIC ANGULAR FILES
// =======================
app.use(express.static(path.join(__dirname, 'dist/book-tracker')));

// =======================
// ROUTES
// =======================
app.use('/', index);
app.use('/api/books', bookRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/authors', authorRoutes);

// =======================
// MONGODB CONNECTION
// =======================
mongoose.connect('mongodb://localhost:27017/book-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to database!');
})
.catch(err => {
  console.log('Connection failed: ' + err);
});

// =======================
// FALLBACK ROUTE (SPA)
// =======================
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist/book-tracker/browser/index.html')
  );
});

// =======================
// SERVER SETUP
// =======================
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log('API running on localhost: ' + port);
});
