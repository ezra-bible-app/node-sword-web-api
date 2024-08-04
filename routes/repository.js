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
const router = express.Router();
const NodeSwordInterface = require('node-sword-interface');
const nsi = new NodeSwordInterface();

router.get('/names', (req, res) => {
  const repoNames = nsi.getRepoNames();
  res.json(repoNames);
});

router.get('/:repoName/languages/:moduleType', (req, res) => {
  const repoName = req.params.repoName;
  const moduleType = req.params.moduleType;
  const languages = nsi.getRepoLanguages(repoName, moduleType);
  res.json(languages);
});

router.get('/:repoName/modules/:moduleType', (req, res) => {
  const repoName = req.params.repoName;
  const moduleType = req.params.moduleType;
  const modules = nsi.getAllRepoModules(repoName, moduleType);
  res.json(modules);
});

module.exports = router;
