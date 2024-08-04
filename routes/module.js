const express = require('express');
const router = express.Router();
const NodeSwordInterface = require('node-sword-interface');
const nsi = new NodeSwordInterface();

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

router.get('/:moduleCode/chapter/:bookCode/:chapter', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const chapter = parseInt(req.params.chapter);

  const chapterText = nsi.getChapterText(moduleCode, bookCode, chapter);
  res.json(chapterText);
});

router.get('/:moduleCode/book/:bookCode/:startVerseNr/:verseCount', (req, res) => {
  const moduleCode = req.params.moduleCode;
  const bookCode = req.params.bookCode;
  const startVerseNr = parseInt(req.params.startVerseNr);
  const verseCount = parseInt(req.params.verseCount);

  const bookText = nsi.getBookText(moduleCode, bookCode, startVerseNr, verseCount);
  res.json(bookText);
});

module.exports = router;
