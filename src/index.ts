import { error, getInput, info, setFailed, warning } from '@actions/core'
import {getStdOutput} from './res/utils';
import * as fs from 'fs';

const workDir: string  = getInput('work_dir').trim();
const maxAttempts: any = getInput('max_attempts').trim();
const dryRun: any      = getInput('dry_run').trim();

( async () => {

    try {
        const state = 'terraform.tfstate'
        if (fs.existsSync(`${workDir}/${state}`))
            await destroy(); 
    }
    catch(e) {
        error('\n File not exist')
        throw e;
    }

async function destroy() {
    try {
        // parsing terraform.tfstate file
        const state = 'terraform.tfstate'
        const stateFile = fs.readFileSync(`${workDir}/${state}`);
        const obj = JSON.parse(stateFile.toString());
        const shareInfoLen = Object.keys(obj.resources).length;
        // destroying resources
        let destroyResources = await getStdOutput(`cd ${workDir} && terraform init && terraform destroy --auto-approve`, [])
        let attempt = 0;
        while (attempt < maxAttempts) {
            attempt++;
            if (shareInfoLen != 0) {
              info(`Prepare for destroying: ${shareInfoLen} resources...\n`);
              info(`\n[LOG] Destroying terraform attempt: ${attempt}`);
              if (dryRun === 0) {
                info('[DEBUG] Taking destroy branch')
                  if (destroyResources) {
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
})();