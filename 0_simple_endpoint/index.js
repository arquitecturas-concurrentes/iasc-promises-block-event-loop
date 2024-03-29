const express = require('express');
const crypto = require('crypto');
const {readFile} = require('fs');

const PID = process.pid;
const PORT = process.env.PORT || 3000;

function log(msg) {
  console.log(`[${PID}] - ${new Date()} -`, msg);
}

function getRandomString() {
    return crypto.randomBytes(500).toString('hex');
  }

const app = express();

app.get('/ping', function ping(req, res) {
  log('ping request incoming');
  res.send('Pong!\n')
});
app.get('/io', function computeIO(req, res) {
  const content = readFile('./blob.bin', function(err, data) {
    if(err){
      console.log(err)
   }              
    res.send(data);
  });
});
app.get('/cpu_intensive', function computeIntensive(req, res) {
  log('computing synchronously... (?)');
  /*
  CPU-intensive
  Crypto: crypto.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFill(), crypto.generateKeyPair().
  Zlib: All zlib APIs except those that are explicitly synchronous use libuv's threadpool.
  */
  const hash = crypto.createHash('sha256');
  for (let i=0; i < 10e6; i++) {
    hash.update(getRandomString())
  }
  log('[cpu_intensive] - Response about to be returned to the user');
  res.send(hash.digest('hex') + '\n');
});

let server = app.listen(PORT, () => log('server listening on :' + PORT));