const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
var mongoose = require('mongoose');
var Search = require('../models/search')

//router.use(authMiddleware);
// CORS MIDDLEWARE
router.use((req,res,next)=>{
  // Origin of access control / CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Credentials');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
router.get('/',authMiddleware, function (req, res, next) {
    Search.find(function (err, search) {
    if (err) {
      res.status(500).send(err);
    }
    else
      res.json(search);
  });
});

/* DELETE product listing. */
router.delete('/:id', async (req, res) => {
 

  console.log("Delete ", req.params.id);
  const { id } = req.params;
  if (id == undefined)
    return res.status(400).send({ error: "need to pass id " });

  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send({ error: "Wrong id format" });

    Search.remove({ _id: req.params.id }, (err, product) => {
    if (err) {
      res.status(500).send({ status: "error", message: err });
      return;
    }
    if (product.n > 0) {
      res.status(200).json({ status: "success", message: 'search deleted!' });
    } else {
      res.status(200).json({ status: "error", message: 'search not found' });
    }

  });
});
module.exports = app => app.use('/search', router);
