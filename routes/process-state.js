var express = require('express');
var router = express.Router();
var app = express();
var processState = require('../utils/process-state.js');

/* GET  data */
router.get('/', function (req, res, next) {
    return res.json({ 'state': processState.getState() });
});

/* POST */
router.post('/reset-state', function (req, res, next) {
    processState.setState(false);
    return res.json({ 'state': processState.getState() });
});
module.exports = router;
