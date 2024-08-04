/* This file is part of ezra-bible-app-server.

   Copyright (C) 2024 ezra-bible-app-server Development Team <contact@ezrabibleapp.net>

   ezra-bible-app-server is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 2 of the License, or
   (at your option) any later version.

   ezra-bible-app-server is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with ezra-bible-app-server. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const setContentType = require('./setContentType.js');
const repositoryRoutes = require('./routes/repository.js');
const localRoutes = require('./routes/local.js');
const moduleRoutes = require('./routes/module.js');

app.use(morgan('tiny')); // Logging middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(setContentType); // set Content-Type to application/json

app.use('/repository', repositoryRoutes);
app.use('/local', localRoutes);
app.use('/module', moduleRoutes);

app.get('/', (req, res) => {
  res.send('This app serves the Ezra Bible App web api!');
});

app.listen(port, () => {
  console.log(`Ezra Bible App server listening on port ${port}`);
});
