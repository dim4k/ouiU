const dl = require('./modules/downloadFile.js');
const config = require('./config.js');

function addLog(message,type){
    let el = document.getElementById("log-container");
    let newItem = document.createElement("LI");       // Create a <li> node
    let textnode = document.createTextNode(message);  // Create a text node
    if(type === "error"){
        newItem.style.color = "red";
    }else if(type === "final"){
        newItem.style.color = "blue";
    }
    newItem.appendChild(textnode);                    // Append the text to <li>
    el.appendChild(newItem);
}

document.getElementById("executeBat").addEventListener("click",function(e){
    const process = require('child_process');
    let ls = process.spawn('test.bat');

    ls.stdout.on('data', (data) => {
        let str = String.fromCharCode.apply(null, data);
        addLog(data);
        console.info(str);
    });
    ls.stderr.on('data', (data) => {
        let str = String.fromCharCode.apply(null, data);
        addLog(data,"error");
        console.error(str);
    });
    ls.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        let preText = `Child exited with code ${code} : `;
        switch(code){
            case 0:
                addLog(preText+"Something unknown happened executing the batch.","final");
                break;
            case 1:
                addLog(preText+"The file already exists","final");
                break;
            case 2:
                addLog(preText+"The file doesn't exists and now is created","final");
                break;
            case 3:
                addLog(preText+"An error ocurred while creating the file","final");
                break;
        }
    });
},false);

document.getElementById("downloadCemu").addEventListener("click",function(e) {
    let filename = getFilenameFromUrl(config.cemuUrl);
    let dlProgressBar = document.getElementById("download-pb");

    function getFilenameFromUrl(url){
        return url.substring(url.lastIndexOf('/') + 1);
    }

    let finalPath = config.downloadPath + "\\" + filename;

    dl.downloadFile(config.cemuUrl, finalPath);

    dl.em.on('dlUpdate', updateProgressBar);

},false);

function updateProgressBar(dlPercentage){
    let dlProgressBar = document.getElementById("download-pb");
    let dlButton = document.getElementById("downloadCemu");

    dlProgressBar.setAttribute("aria-valuenow", dlPercentage);
    dlProgressBar.setAttribute("style", "width : " + dlPercentage + "%;");

    if (dlPercentage === 100){
        dlProgressBar.closest(".progress").style.display = 'none';
        dlButton.innerHTML = "Download complete !";
        dlButton.setAttribute("class", "btn btn-success");
        dlProgressBar.setAttribute("class", "progress-bar bg-success");
    } else {
        dlProgressBar.closest(".progress").style.display = 'flex';
        dlButton.innerHTML = "Downloading...";
        dlButton.setAttribute("class", "btn btn-primary");
        dlProgressBar.setAttribute("class", "progress-bar progress-bar-striped");
    }
}