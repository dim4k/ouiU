const request = require('request');
const fs = require('fs');
const events = require('events');
let eventEmitter = new events.EventEmitter();

module.exports = {downloadFile : downloadFile, em : eventEmitter };

function downloadFile(file_url , targetPath, dlPercentage){
    // Save variable to know progress
    let received_bytes = 0;
    let total_bytes = 0;

    let req = request({
        method: 'GET',
        uri: file_url
    });

    let out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length' ]);
    });

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length;

        dlPercentage = Math.floor((received_bytes * 100) / total_bytes);
        eventEmitter.emit('dlUpdate', dlPercentage);
        showProgress(received_bytes, total_bytes);
    });

    req.on('end', function() {
        eventEmitter.emit('dlUpdate', 100);
    });
}

function showProgress(received,total){
    let percentage = Math.floor((received * 100) / total);
}