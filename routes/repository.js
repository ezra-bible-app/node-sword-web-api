const express = require('express');
const router = express.Router();
const NodeSwordInterface = require('node-sword-interface');
const nsi = new NodeSwordInterface();

router.get('/names', (req, res) => {
  const repoNames = nsi.getRepoNames();
  res.json(repoNames);
});

router.get('/:repoName/:moduleType/languages', (req, res) => {
  const repoName = req.params.repoName;
  const moduleType = req.params.moduleType;
  const languages = nsi.getRepoLanguages(repoName, moduleType);
  res.json(languages);
});

router.get('/:repoName/:moduleType/modules', (req, res) => {
  const repoName = req.params.repoName;
  const moduleType = req.params.moduleType;
  const modules = nsi.getAllRepoModules(repoName, moduleType);
  res.json(modules);
});

module.exports = router;
