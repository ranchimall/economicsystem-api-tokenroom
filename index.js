const express = require('express');
const app = express();
const economicSystemRoutes = require('./routes/economicSystem');

// Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.use('/api/economicSystem', economicSystemRoutes);

// Hello World route
app.get('/helloworld', (req, res) => {
    res.send('Hello, World!');
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
