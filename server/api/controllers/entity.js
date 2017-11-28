var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const entity = {
    id: 0,
    name: 'Entity Name',
    details: 'I am some entity.'
  };
  res.status(200).send(entity);
});

module.exports = router;
