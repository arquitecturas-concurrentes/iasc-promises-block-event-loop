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

function setTimeoutPromise(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
}
 
function setImmediatePromise(delay) {
  return new Promise((resolve) => {
    setImmediate(() => resolve(), delay);
  });
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
app.get('/cpu_intensive', async function computeIntensive(req, res) {
  log('computing Itensive cpu load....');

  const asyncUpdate = async () => hash.update(getRandomString());

  const hash = crypto.createHash('sha256');

  for (let i = 0; i < 10e5; i++) {
    await asyncUpdate();
    await setImmediatePromise(0)
  }

  log('[cpu_intensive] - Response about to be returned to the user');
  res.send(hash.digest('hex') + '\n');
});
app.get('/cpu_intensive_partition', async function computeIntensive(req, res) {
  log('computing Itensive cpu load....');
  const hash = crypto.createHash('sha256');

  function updatePartitioned(hash, threshold, callback) {
    var i = 0;

    function help(i, cb) {
     if (i == threshold) {
       cb(hash);
       return;
     } 

     hash.update(getRandomString());
     setImmediate(help.bind(null, i+1, cb));
    }
    
    help(1, function(hash) {
      callback(hash);
    })
  }

  updatePartitioned(hash, 10e5, function(result) {
    log('[cpu_intensive] - Response about to be returned to the user');
    res.send(hash.digest('hex') + '\n');
  });
});

let server = app.listen(PORT, () => log('server listening on :' + PORT));