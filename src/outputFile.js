const path = require('path')

function fileAlreadyExists(filePath){
    const fs = require('fs')

    return fs.statSync(filePath, function(err, stat) {
        if(err == null)
            return true
        // else if(err.code === 'ENOENT')
        //     return false
        // else
        //     return false
        return false
    })
}

function getOutputWriter(filePath){
    if(filePath && fileAlreadyExists)
            console.log(filePath + "\nFile already exists. It will be overwritten. If not intended, please backup the file and restart the program.")
    else
        filePath = `record-${new Date().toDateString().split(' ').join('-')}.csv`
    
    const csvWriter = require('csv-writer').createObjectCsvWriter({
        path: filePath,
        header: [
            {id: 'Sno', title: 'SNo'},
            {id: 'ReqTime', title: 'Time Of Request'},
            {id: 'Req', title: 'Request'},
            {id: 'ResTime', title: 'Time of Response'},
            {id: 'Res', title: 'Response'},
            {id: 'Status', title: 'Status'},
            {id: 'Error', title: 'Error'}
        ]
    })
    return csvWriter
}

module.exports = {
    fileAlreadyExists,
    getOutputWriter
}