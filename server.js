/* This file is part of node-sword-web-api.

   Copyright (C) 2024 node-sword-web-api Development Team <contact@ezrabibleapp.net>

   node-sword-web-api is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 2 of the License, or
   (at your option) any later version.

   node-sword-web-api is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with node-sword-web-api. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const setContentType = require('./setContentType.js');
const localRoutes = require('./routes/local.js');
const moduleRoutes = require('./routes/module.js');
const strongsRoutes = require('./routes/strongs.js');

app.use(morgan('tiny')); // Logging middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(setContentType); // set Content-Type to application/json

app.use('/local', localRoutes);
app.use('/module', moduleRoutes);
app.use('/strongs', strongsRoutes);

app.get('/', (req, res) => {
  res.send('This app serves the node-sword-web-api!');
});

app.listen(port, () => {
  console.log(`node-sword-web-api server listening on port ${port}`);
});
