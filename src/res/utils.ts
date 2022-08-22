namespace Parse {
    // parsing terraform.tfstate file
    const stateFile = fs.readFileSync(`${dir}/${state}`);
    const obj = JSON.parse(stateFile.toString());
    export const shareInfoLen = Object.keys(obj.resources).length;
}