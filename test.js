const execSync = require('child_process').execSync;
const fs = require('fs');

const { uid, gid } = isRoot ? inferOwner.sync(cwd) : {}