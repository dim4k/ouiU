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
    let myBatFilePath = "C:\\Users\\Antoine\\Desktop\\test.bat";
    const spawn = require('child_process').spawn;
    const bat = spawn('cmd.exe', ['/c', myBatFilePath]);
    bat.stdout.on('data', (data) => {
        let str = String.fromCharCode.apply(null, data);
        addLog(data);
        console.info(str);
    });
    bat.stderr.on('data', (data) => {
        let str = String.fromCharCode.apply(null, data);
        addLog(data,"error");
        console.error(str);
    });
    bat.on('exit', (code) => {
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