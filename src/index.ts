import * as fs from 'fs';
import { setFailed, info, getInput, warning} from '@actions/core';
import * as path from 'path';
import { getStdOutput } from './res/utils';



const dir        : string  = './';
// const maxAttempts: number  = 3;
// const dryRun     : boolean = false;


// const dir: string  = getInput('work_dir');
// const maxAttempts  = getInput('max_attempts');
// const dryRun      : boolean = getInput('dry_run');
// const state       : any     = fs.readdirSync(dir).filter(fn => fn.endsWith('.tfstate'))



async function run() {
    try {
        await outputAllFolders(([path.resolve(dir)]));        
    }
    catch(e) {
        throw e;
    }
}

// async function destroy() {
//     try {
//         await loop();
//     }
//     catch(e) {
//         throw e;
//     }
// }

// async function loop() {
//      // parsing terraform.tfstate file
//     const stateFile = fs.readFileSync(`${dir}/${state}`);
//     const obj = JSON.parse(stateFile.toString());
//     const shareInfoLen = Object.keys(obj.resources).length;
//     console.log(shareInfoLen);
    

//     // destroying resources
//     const destroyResources = async () => {return getStdOutput('terraform', [ `-chdir=${dir}`, 'init' ])};
//     const destroy          = async () => {return getStdOutput('terraform', [ `-chdir=${dir}`, 'destroy', '--auto-approve' ])};
//     let attempt: number    = 0;

//     do {
//         (attempt=0,attempt++);
//         if (shareInfoLen !== 0) {
//           info(`Prepare for destroying: ${shareInfoLen} resources...\n`);
//           info(`\n[LOG] Destroying terraform attempt: ${attempt}...`);
//           if (dryRun === false) {
//             info('[DEBUG] Taking destroy branch')
//               if (await destroyResources() && await destroy()) {
//                 info(`[LOG] Resources was destroyed on: ${attempt} [${dryRun}]`)
//                 break;
//               } else {
//                   warning(`[WARN] Failed to destroy: ${attempt} [${dryRun}]`)
//               }
//           } else {
//               info(`[LOG] Destroyed resources on attempt: ${attempt}`)
//               break;
//           }
//         } else {
//             info(`"${state}" was already empty`);
//             break;
//         }

//         if (shareInfoLen !== 0) {
//             setFailed(`[ERROR] Unable to destroy terraform state [${state}]`)
//         }

//     } while(attempt < maxAttempts)    
// }

async function outputAllFolders(folderPaths: string[]) {
    folderPaths.forEach(folderPath => {
        const results          = fs.readdirSync(folderPath);
        const folders          = results.filter(res => fs.lstatSync(path.resolve(folderPath, res)).isDirectory())
        const innerFolderPaths = folders.map(folder => path.resolve(folderPath, folder))
        
        if(innerFolderPaths.length === 0) {
          return
        }
        
        innerFolderPaths.forEach(innerFolder => {
          
            const stateFile        = fs.readdirSync(innerFolder, { withFileTypes: true });
            const init             = async () => {return getStdOutput('terraform', [ `-chdir=${innerFolder}`, 'init' ])};
            const destroy          = async () => {return getStdOutput('terraform', [ `-chdir=${innerFolder}`, 'destroy', '--auto-approve' ])};
            
          stateFile.forEach(async (item) => {
            
            if (path.extname(item.name) === ".tfstate") {
              const reader = fs.readFileSync(`${innerFolder}/${item.name}`)
              
              if (reader.length !== 0) {
                const json = JSON.parse(reader.toString())
                const shareInfoLen = Object.keys(json.resources).length;
                 
                const showFile = async () => {return getStdOutput('cat', [`${innerFolder}/${item.name}`])}
                
                if(shareInfoLen !== 0) {
                  console.log(`\n${innerFolder}/${item.name} has ${shareInfoLen} resource(s)!`);
                  console.log(`Destroying ${shareInfoLen} resource(s)....` );
              
                  try {
                    await init() && await destroy()
                    console.log(`${shareInfoLen} resource(s) was succesfully destroyed!`);
                  } catch {
                    info(`ERROR Found!`);
                    await showFile() 
                    info(`\nContent of [${innerFolder}/${item.name}] below\n`);
                  }

                } else {
                  console.log(`Not resource(s) in ${innerFolder}/${item.name}`);  
                }
                
              } else {
                console.log(`${innerFolder}/${item.name} is empty!`);    
              }

            } else {
                return;
                
            }
          });

          if(stateFile.length === 0) {
          return
          }
        })
        outputAllFolders(innerFolderPaths)    
    })       
}

run().catch(err => setFailed(err.message));
