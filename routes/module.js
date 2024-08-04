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
nsi.enableMarkup();

router.get('/:moduleCode/raw/:key', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const key = req.params.key;

  const entry = nsi.getRawModuleEntry(moduleCode, key);
  res.send(entry);
});

router.get('/:moduleCode/text/:key', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const key = req.params.key;

  const entry = nsi.getReferenceText(moduleCode, key);
  res.json(entry);
});

router.get('/:moduleCode/chaptertext/:bookCode/:chapter', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const chapter = parseInt(req.params.chapter);

  const chapterText = nsi.getChapterText(moduleCode, bookCode, chapter);
  res.json(chapterText);
});

router.get('/:moduleCode/booktext/:bookCode/:startVerseNr/:verseCount', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const startVerseNr = parseInt(req.params.startVerseNr);
  const verseCount = parseInt(req.params.verseCount);

  const bookText = nsi.getBookText(moduleCode, bookCode, startVerseNr, verseCount);
  res.json(bookText);
});

router.get('/:moduleCode/bookintro/:bookCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const introduction = nsi.getBookIntroduction(moduleCode, bookCode);
  res.json(introduction);
});

router.get('/:moduleCode/bookchaptercount/:bookCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const bookChapterCount = parseInt(nsi.getBookChapterCount(moduleCode, bookCode));
  res.json(bookChapterCount);
});

router.get('/:moduleCode/chapterversecount/:bookCode/:chapter', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const chapter = parseInt(req.params.chapter);
  const chapterVerseCount = parseInt(nsi.getChapterVerseCount(moduleCode, bookCode, chapter));
  res.json(chapterVerseCount);
});

router.get('/:moduleCode/books', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const books = nsi.getBookList(moduleCode);
  res.json(books);
});

module.exports = router;
