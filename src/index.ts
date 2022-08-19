const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const dir = core.getInput('dir');
const stateFile = 'terraform.tfstate';

async function run() {
    try {    
        if (fs.existsSync(`${dir}./${stateFile}`)) {
            console.log("continue");
        } else {
            console.log("stop");
        }
    }
    catch (e){
        core.console.error("failed");        
    }

    try {   
        let stateFiles = fs.readFileSync(`${dir}/${stateFile}`);
        let obj = JSON.parse(stateFiles);
        const shareInfoLen = Object.keys(obj.resources).length; 
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