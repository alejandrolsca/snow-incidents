// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    // Create a worker for each CPU
    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    // Listen for online workers
    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // Listen for dying workers
    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

    // Code to run if we're in a worker process
} else {

  var express = require('express');
  var app = express();

  app.use('/css', express.static('css'));
  app.use('/bower_components', express.static('bower_components'));
  app.use('/app', express.static('app'));

  app.use(function(req, res, next){
    res.status(404).send('Sorry cant find that!');
  });

  var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server running on worker %d listening at http://%s:%s', cluster.worker.id, host, port);
    });

    console.log('Worker %d running!', cluster.worker.id);

}