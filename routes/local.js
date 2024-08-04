const express = require('express');
const router = express.Router();
const NodeSwordInterface = require('node-sword-interface');
const nsi = new NodeSwordInterface();

router.get('/modules/:moduleType', (req, res) => {
  const moduleType = req.params.moduleType;
  const allLocalModules = nsi.getAllLocalModules(moduleType);
  res.json(allLocalModules);
});

module.exports = router;
