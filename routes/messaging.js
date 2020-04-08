const express = require('express');
const router = express.Router();
const messaging = require('../services/messaging')

router.post('/register', (req,res) => {
  id = messaging.register()
  res.json({id})
})

router.post('/send', (req,res) => {
  ok = messaging.sendMessage(req.body.from, req.body.to, req.body.data)
  res.json({ok})
})

router.post('/pop', (req,res) => {
  msgs = messaging.popMessages(req.body.id)
  res.json(msgs)
})

router.post('/brodcast', (req,res) => {
  messaging.brodcast(req.body.from, req.body.data)
  res.json({ok:true})
})

module.exports = router;
