const http = require('http');
const ProgressBar = require('progress');
const fs = require('fs');

module.exports = {
    get: function(host, path, destName, msg, cb) {
        var req = http.request({
            host: host,
            path: path,
        });

        var stream = fs.createWriteStream(destName);

        req.on('socket', (socket) => {
            socket.setTimeout(5000);
            socket.on('timeout', () => {
                req.abort();
            });
        });

        req.on('error', err => {
            if (err.code === "ECONNRESET") {
                var error = new Error('Timeout occurs.')
                cb(error);
            }
            if (err) cb(err);
        });

        req.on('response', function(res) {
            if (res.statusCode == 200) {
                var len = parseInt(res.headers['content-length'], 10);
                var size = 0;

                var bar = new ProgressBar(msg + ' [:bar] :percent (:etas)', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: len
                });

                res.on('data', function(chunk) {
                    bar.tick(chunk.length);
                    stream.write(chunk);
                    size = size + chunk.length;
                });

                res.on('end', function() {
                    stream.end();
                    cb(null, size);
                });
            } else {
                var error = new Error('Error:   ' + res.statusCode);
                cb(error);
            }
        });
        req.end();
    },
    getNoProgressBar: function(host, path, destName, cb) {
        var req = http.request({
            host: host,
            path: path
        });

        var stream = fs.createWriteStream(destName);

        req.on('socket', (socket) => {
            socket.setTimeout(5000);
            socket.on('timeout', () => {
                req.abort();
            });
        });

        req.on('error', err => {
            if (err.code === "ECONNRESET") {
                var error = new Error('Timeout occurs.')
                cb(error);
            }
            if (err) cb(err);
        });

        req.on('response', function(res) {
            if (res.statusCode == 200) {
                res.on('data', function(chunk) {
                    stream.write(chunk);
                });

                res.on('end', function() {
                    stream.end();
                    cb(null);
                });
            } else {
                var error = new Error('Error:   ' + res.statusCode);
                cb(error);
            }
        });
        req.end();
    }
}; 
