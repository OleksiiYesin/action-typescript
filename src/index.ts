import * as fs from 'fs';
import { execSync } from 'child_process';
import { setFailed, info, error, getInput, warning} from '@actions/core';
import { getStdOutput } from './res/utils';


const dir               = getInput('work_dir');
const maxAttempts: any  = getInput('max_attempts');
const dryRun: any       = getInput('dry_run');
const state             = 'terraform.tfstate'


async function run() {
    try {
        if (fs.existsSync(`${dir}/${state}`))
            await destroy(); 
    }
    catch(e) {
        error('\n File not exist')
        throw e;
    }
}


async function destroy() {
    try {
        
        // parsing terraform.tfstate file
        const stateFile = fs.readFileSync(`${dir}/${state}`);
        const obj = JSON.parse(stateFile.toString());
        const shareInfoLen = Object.keys(obj.resources).length;

        // destroying resources
        const destroyResources = async () => {return await getStdOutput('terraform', [ `-chdir=${dir}`, 'init' ])};
        const destroy = await getStdOutput('terraform', [ `-chdir=${dir}]`, 'destroy', '--auto-approve']);
        let attempt = 0;
        
        while (attempt < maxAttempts) {
            attempt++;
            if (shareInfoLen != 0) {
              info(`Prepare for destroying: ${shareInfoLen} resources...\n`);
              info(`\n[LOG] Destroying terraform attempt: ${attempt}...`);
              if (dryRun === 0) {
                info('[DEBUG] Taking destroy branch')
                  if (await destroyResources) {
                    info(`[LOG] Resources was destroyed on: ${attempt} [${dryRun}]`)
                    break;
                  } else {
                      warning(`[WARN] Failed to destroy: ${attempt} [${dryRun}]`)
                  }
              } else {
                  info(`[LOG] Destroyed resources on attempt: ${attempt}`)
                  break;
              }
            } else {
                info(`"${state}" was already empty`)
            }
        }
    }
    catch(e) {
        throw e;
    }
}

run().catch(err => setFailed(err.message));