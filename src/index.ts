const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const dir = core.getInput('dir');
const tf = core.getInput('state_file');

async function run() {
    try {    
        if (fs.existsSync(`${dir}/${tf}`)) {
            console.log("continue");
        } else {
            console.log("stop");
        }
    }
    catch (e){
        core.console.error("failed");        
    }

    try {   
        let stateFiles = fs.readFileSync(`${dir}/${tf}`);
        let obj = JSON.parse(stateFiles);
        const shareInfoLen = Object.keys(obj.resources).length; 
        console.log(shareInfoLen);
        const maxAttempts = 3;
        let attempt = 0;
        while (attempt < maxAttempts) {
            attempt++
            if (shareInfoLen != 0) {
                console.log(`Destroying terraform attempt ${attempt}`);
            } else {
                console.log(`Not resources on attempt ${attempt}`);
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

run();