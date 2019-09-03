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
  log('computing asynchronously... (?)');

  const hash = crypto.createHash('sha256');

  function asyncUpdate(hash) { 
    return new Promise ((resolve, reject) => {
      resolve(hash.update(getRandomString()));
    });
  }

  for (let i = 0; i < 10e5; i++) {
    asyncUpdate(hash);
  }

  log('[cpu_intensive] - Response about to be returned to the user');
  res.send(hash.digest('hex') + '\n');
});
app.get('/cpu_intensive_async', async function computeAsync(req, res) {
  log('computing asynchronously... (?)');

  const hash = crypto.createHash('sha256');

  const asyncUpdate = async () => hash.update(getRandomString());

  for (let i = 0; i < 10e5; i++) {
    await asyncUpdate();
  }

  log('[cpu_intensive] - Response about to be returned to the user');
  res.send(hash.digest('hex') + '\n');
});

let server = app.listen(PORT, () => log('server listening on :' + PORT));