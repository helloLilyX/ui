
'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');

const packagePath = process.cwd();
const distPath = path.join(packagePath, './dist');
const srcPath = path.join(packagePath, './src');

function copyTypescript({ from, to }) {
    const files = glob.sync('**/*.d.ts', { cwd: from });
    const cmds = files.map(file =>
        fs.copyFileSync(path.resolve(from, file), path.resolve(to, file))
    );

    return cmds;
}

copyTypescript({ from: srcPath, to: distPath });