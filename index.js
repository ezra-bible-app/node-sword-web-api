const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const setContentType = require('./setContentType.js');
const repositoryRoutes = require('./routes/repository.js');

app.use(morgan('tiny')); // Logging middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(setContentType); // set Content-Type to application/json
app.use('/repository', repositoryRoutes);

app.get('/', (req, res) => {
  res.send('This app serves the Ezra Bible App web api!');
});

app.listen(port, () => {
  console.log(`Ezra Bible App api listening on port ${port}`);
});
