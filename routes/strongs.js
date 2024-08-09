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
const router = express.Router();
const NodeSwordInterface = require('node-sword-interface');
const nsi = new NodeSwordInterface();

router.get('/strongsentry/:strongskey', (req, res) => {
  const strongsKey = req.params.strongskey;
  const strongsEntry = nsi.getStrongsEntry(strongsKey);
  res.json(strongsEntry);
});

router.get('/strongsavailable', (req, res) => {
  const strongsAvailable = nsi.strongsAvailable();
  res.json(strongsAvailable);
});

router.get('/hebrewstrongsavailable', (req, res) => {
  const strongsAvailable = nsi.hebrewStrongsAvailable();
  res.json(strongsAvailable);
});

router.get('/greekstrongsavailable', (req, res) => {
  const strongsAvailable = nsi.greekStrongsAvailable();
  res.json(strongsAvailable);
});

module.exports = router;
