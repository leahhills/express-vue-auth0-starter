var express = require('express');
var router = express.Router();

// get current user data
router.get('/', function(req, res, next) {
    if (!req.user)
        res.sendStatus(404);
    else
        res.status(200).send(req.user);
});

module.exports = router;
