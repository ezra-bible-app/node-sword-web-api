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
const crypto = require('crypto');
const router = express.Router();
const NodeSwordInterface = require('node-sword-interface');
const nsi = new NodeSwordInterface();
nsi.enableMarkup();

// In-memory store for task progress and results
global.searchTasks = {};

router.get('/searchsession', (req, res) => {
  const sessionId = crypto.randomUUID();
  global.searchTasks[sessionId] = { progress: 0, status: 'pending', results: null };
  
  // Send the session ID to the client
  res.json(sessionId);
});

router.get('/:moduleCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const module = nsi.getLocalModule(moduleCode);
  res.json(module);
});

router.get('/:moduleCode/raw/:key', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const key = req.params.key;
  const entry = nsi.getRawModuleEntry(moduleCode, key);
  res.json(entry);
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

router.get('/:moduleCode/bookheaderlist/:bookCode/:startVerseNr/:verseCount', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const startVerseNr = parseInt(req.params.startVerseNr);
  const verseCount = parseInt(req.params.verseCount);
  const bookHeaders = nsi.getBookHeaderList(moduleCode, bookCode, startVerseNr, verseCount);
  res.json(bookHeaders);
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
  const bookChapterCount = nsi.getBookChapterCount(moduleCode, bookCode);
  res.json(bookChapterCount);
});

router.get('/:moduleCode/chapterversecount/:bookCode/:chapter', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const chapter = parseInt(req.params.chapter);
  const chapterVerseCount = nsi.getChapterVerseCount(moduleCode, bookCode, chapter);
  res.json(chapterVerseCount);
});

router.get('/:moduleCode/bookversecount/:bookCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const bookVerseCount = nsi.getBookVerseCount(moduleCode, bookCode);
  res.json(bookVerseCount);
});

router.get('/:moduleCode/allchapterversecounts/:bookCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const allChapterVerseCounts = nsi.getAllChapterVerseCounts(moduleCode, bookCode);
  res.json(allChapterVerseCounts);
});

router.get('/:moduleCode/bookabbreviations/:bookCodes/:localeCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCodes = req.params.bookCodes.split(',');
  const localeCode = req.params.localeCode;

  let abbreviations = [];

  for (let i = 0; i < bookCodes.length; i++) {
    let abbreviation = nsi.getBookAbbreviation(moduleCode, bookCodes[i], localeCode);
    abbreviations.push(abbreviation);
  }

  res.json(abbreviations);
});

router.get('/:moduleCode/books', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const books = nsi.getBookList(moduleCode);
  res.json(books);
});

router.get('/:moduleCode/search/:sessionId/:searchTerm/:searchType/:searchScope/:isCaseSensitive/:useExtendedVerseBoundaries', async (req, res) => {
  const moduleCode = req.params.moduleCode;
  const sessionId = req.params.sessionId;
  const searchTerm = req.params.searchTerm;
  const searchType = req.params.searchType;
  const searchScope = req.params.searchScope;
  const isCaseSensitive = req.params.isCaseSensitive === 'true';
  const useExtendedVerseBoundaries = req.params.useExtendedVerseBoundaries === 'true';

  if (!global.searchTasks[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  global.searchTasks[sessionId].status = 'in-progress';

  nsi.getModuleSearchResults(
    moduleCode,
    searchTerm,
    (progress) => {
      global.searchTasks[sessionId].progress = progress;
    },
    searchType,
    searchScope,
    isCaseSensitive,
    useExtendedVerseBoundaries
  ).then((results) => {
    global.searchTasks[sessionId].status = 'completed';
    global.searchTasks[sessionId].results = results;
  });

  // Set the connection header to close, so that the http connection is not kept alive.
  res.set("Connection", "close");

  // The 202 status code indicates that a request has been accepted for processing,
  // but processing has not been completed or may not have started.
  res.status(202);

  // Explicitly end the response.
  res.end();
});

router.get('/searchprogress/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  if (!global.searchTasks[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const task = global.searchTasks[sessionId];
  res.json({ sessionId, progress: task.progress, status: task.status });
});

router.get('/searchresults/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  if (!global.searchTasks[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const task = global.searchTasks[sessionId];
  res.json(task.results);
});

router.get('/:moduleCode/versesfromreferences/:references', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const references = req.params.references.split(',');
  const verses = nsi.getVersesFromReferences(moduleCode, references);
  res.json(verses);
});

router.get('/:moduleCode/hasbook/:bookCode', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const moduleHasBook = nsi.moduleHasBook(moduleCode, bookCode);
  res.json(moduleHasBook);
});

module.exports = router;
