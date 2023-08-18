var JavaScriptObfuscator = require('javascript-obfuscator');
const { readFile } = require('fs/promises');
var fs = require("fs");

function basename(path) {
    return path.split('/').reverse()[0];
 }

(async ()=>{
    if (process.argv.length < 3) {
        console.log("no path provided");
        return;
    }
    const moveFrom = process.argv[2];
    const saveToPath = process.cwd();
    if (!fs.existsSync(moveFrom)) {
        console.log("unknown path ", moveFrom);
    } else if (fs.statSync(moveFrom).isFile()) {
        if (moveFrom.endsWith(".js")) {
            obfuscateFile(moveFrom, saveToPath);
        } else {
            console.log("not a .js file");
        }
    } else if (fs.statSync(moveFrom).isDirectory()) {
        obfuscateDirectory(moveFrom, saveToPath);
    } else {
        console.log("unknown file type");
    }
})();

function obfuscateJsCode(jsCode){
    return JavaScriptObfuscator.obfuscate(jsCode, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
    }).getObfuscatedCode();
}

async function obfuscateFile(filePath, saveToPath){
    fs.writeFileSync(saveToPath + "/" + basename(filePath), obfuscateJsCode(await readFile(filePath, 'utf8')));
}

async function obfuscateDirectory(dirPath, oldSaveToPath){
    let newSaveToPath = oldSaveToPath + "/" + basename(dirPath);
    fs.mkdirSync(newSaveToPath);
    fs.readdirSync(dirPath).forEach(async (file)=>{
        if (file[0] == ".") return;
        if (file.endsWith(".js")) {
            obfuscateFile(dirPath + "/" + file, newSaveToPath);
        } else if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            obfuscateDirectory(dirPath + "/" + file, newSaveToPath);
        }
    });
}