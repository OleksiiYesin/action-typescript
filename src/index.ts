import * as fs from 'fs';
import { execSync } from 'child_process';
import * as core from '@actions/core';
import { getStdOutput } from './res/utils';


const dir               = core.getInput('work_dir');
const maxAttempts: any  = core.getInput('max_attempts');
const dryRun: any       = core.getInput('dry_run');
const state             = 'terraform.tfstate'

async function run() {
    try {
        if (fs.existsSync(`${dir}/${state}`))
            await destroy(); 
    }
    catch(e) {
        core.error('\n File not exist')
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
        const destroyResources = getStdOutput(`terraform -chdir=${dir} init && terraform -chdir=${dir} destroy --auto-approve`, []);
        let attempt = 0;
        while (attempt < maxAttempts) {
            attempt++;
            if (shareInfoLen != 0) {
              core.info(`Prepare for destroying: ${shareInfoLen} resources...\n`);
              core.info(`\n[LOG] Destroying terraform attempt: ${attempt}`);
              if (dryRun === 0) {
                core.info('[DEBUG] Taking destroy branch')
                  if (await destroyResources) {
                    core.info(`[LOG] Resources was destroyed on: ${attempt} [${dryRun}]`)
                    break;
                  } else {
                      core.warning(`[WARN] Failed to destroy: ${attempt} [${dryRun}]`)
                  }
              } else {
                  core.info(`[LOG] Destroyed resources on attempt: ${attempt}`)
                  break;
              }
            } else {
                core.info(`"${state}" was already empty`)
            }
        }
    }
    catch(e) {
        throw e;
    }
}

run().catch(err => core.setFailed(err.message));