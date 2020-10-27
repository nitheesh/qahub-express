var express = require('express');
var router = express.Router();
var processState = require("../utils/process-state.js");
var bsConfig = require("../bs-configs/config.json");
const backstop = require("backstopjs");
const fs = require('fs-extra')

router.get('/', function(req, res, next) {
  res.json({status: 200, msg: "BSJ Index"});
});

router.get('/status', function(req, res, next) {
  var status = processState.getState();
  if (status) {
    res.json({status: 409, msg: status});
  }
  else {
    res.json({status: 200, msg: status});
  }
});

router.get('/toggle-status', function(req, res, next) {
  processState.toggleState();
  res.json({status: 200, msg: processState.getState()});
});

/* Create reference images */
router.post('/create-reference', function(req, res) {
  if (processState.getState()) {
    return res.json({ status: 409, msg: 'Backstop already in use' })
  }
  processState.setState(true);
  const scenarios = req.body.scenarios
  const id = req.body.website_id
  bsConfig['id'] = id
  bsConfig['paths'] = GetPaths(id)
  bsConfig['scenarios'] = scenarios

  backstop('reference', {
    config: bsConfig
  })
  .then(() => {
    processState.setState(false)
    res.json({status: 200, msg: "Reference images created successfully"});
  }).catch(err => {
    processState.setState(false)
    res.json({status: 500, msg: "Unable to create reference images."});
  });
});

/* Run tests */
router.post('/run-test', function(req, res) {
  if (processState.getState()) {
    return res.json({ status: 409, msg: 'Backstop already in use' })
  }
  processState.setState(true);
  const scenarios = req.body.scenarios
  const id = req.body.website_id
  bsConfig['id'] = id
  bsConfig['paths'] = GetPaths(id)
  bsConfig['scenarios'] = scenarios
  CleanTestDir(id);

  backstop('test', {
    config: bsConfig
  })
  .then(() => {
    processState.setState(false)
    res.json({status: 200, msg: "Tests completed successfully."});
  }).catch(err => {
    processState.setState(false)
    res.json({status: 500, msg: "Some tests failed."});
  });
});

/* Approve tests */
router.post('/run-approve', function(req, res) {
  if (processState.getState()) {
    return res.json({ status: 409, msg: 'Backstop already in use' })
  }
  processState.setState(true);
  const scenarios = req.body.scenarios
  const id = req.body.website_id
  bsConfig['id'] = id
  bsConfig['paths'] = GetPaths(id);
  bsConfig['scenarios'] = scenarios

  backstop('approve', {
    config: bsConfig
  })
  .then(() => {
    processState.setState(false)
    res.json({status: 200, msg: "Approved successfully."});
  }).catch(err => {
    processState.setState(false)
    res.json({status: 500, msg: "Unable to approve. Please try again later."});
  });
});

/* Empty test directory */
function CleanTestDir(id) {
  var dir = "backstop_data/bitmaps_test/" + id;
  fs.emptyDir(dir)
    .then(() => {
      console.log('Test directory is clean!')
    })
    .catch(err => {
      console.error(err)
    })
}

/* Returns backstopjs paths data */
function GetPaths(id) {
  return {
    "bitmaps_reference": "backstop_data/bitmaps_reference/" + id,
    "bitmaps_test": "backstop_data/bitmaps_test/" + id,
    "engine_scripts": "engine_scripts",
    "html_report": "backstop_data/html_report/" + id,
    "ci_report": "backstop_data/ci_report/" + id
  }
}

// router.get('/:website/ref', function(req, res) {
//     var website = req.params.website;
//     var bsConfig = require(bsConfigDir + website +".live.json");
//     backstop('reference', {
//       config: bsConfig
//     })
//     .then(() => {
//       res.json({status: 200, msg: "Approved successfully."});
//     }).catch(err => {
//       res.json({status: 500, msg: "Approved successfully."});
//     });
// });

// router.get('/:website/test', function(req, res) {
//     var website = req.params.website;
//     var bsConfig = require(bsConfigDir + website +".live.json");
//     backstop('test', {
//       config: bsConfig
//     })
//     .then(() => {
//       res.json({status: 200, msg: "Tests completed successfully."});
//     }).catch(() => {
//       res.json({status: 200, msg: "Some tests failed."});
//     });
// });
//
// router.get('/:website/approve', function(req, res) {
//     var website = req.params.website;
//     var bsConfig = require(bsConfigDir + website +".live.json");
//     backstop('approve', {
//       config: bsConfig
//     })
//     .then(() => {
//       res.json({status: 200, msg: "Approved successfully."});
//     }).catch(() => {
//       res.json({status: 500, msg: "Unable to approve."});
//     });
// });

module.exports = router;
