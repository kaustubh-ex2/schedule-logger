const { fileAlreadyExists } = require("./outputFile")

/**
* Read all URLs from the file if it exists,
* otherwise treat the input parameter as the sole URL
*/
async function readInput(inputParam, baseUrl){
    let urlArray = []
    if(fileAlreadyExists(inputParam)){
        console.log("Input file exists")
        urlArray = await getLinesFromFile(inputParam)
    }
    else{
        urlArray = [inputParam]
    }
    if(baseUrl){
        urlArray = urlArray.map(url => baseUrl + url)
    }
    return urlArray
}

function getLinesFromFile(filePath){
    const urlArray = []
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(filePath)
    })
    return new Promise((resolve, reject) => {
        lineReader.on('line', function(line){
            if(line)
                urlArray.push(line)
        })
        lineReader.on('close', () => resolve(urlArray))
    })
}

module.exports = readInput