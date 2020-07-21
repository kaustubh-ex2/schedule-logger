#!/usr/bin/env node

const fetch = require("node-fetch")
const cron = require("node-schedule")
const { getOutputWriter } = require("./src/outputFile.js")
const readInput = require("./src/readInput.js")

const yargs = require("yargs")
                .usage("Usage -i <path to file containing urls>")
                .option("i", {alias: "input", describe: "Input file", demandOption: true, type: "string"})
                .coerce("i", arg => require('path').resolve(__dirname, arg))
                .option("b", {alias: "base", describe: "Base URL. Will be prepended to each url if passed."})
                .option("o", {alias: "output", describe: "Path to output file. Must be a csv"})
                .coerce("o", arg => require('path').resolve(__dirname, arg))
                .option("t", {alias: "timing", describe: "The job timing in cron format. Default will be [*/10 * * * *] (i.e. Every 10 minutes)", default: "*/10 * * * *"})
                .argv;
(async () => {
    const writer = getOutputWriter(yargs.o)
    const requests = await readInput(yargs.i, yargs.b)

    const j = cron.scheduleJob(yargs.t, function(){
        JustDoIt()
    })
    console.log("Job started...")

    let SnoCounter = 0
    function JustDoIt()
    {
        requests.forEach((requestUrl, ind) => {
            setTimeout(function(){
                
                var dataToAppend = [{
                    Sno: ++SnoCounter,
                    Req: requestUrl,
                    ReqTime: new Date().toString()
                }]
                fetch(requestUrl)
                .then(raw => {
                    console.log(raw)
                    dataToAppend[0].Status = raw.status
                    dataToAppend[0].ResTime = new Date().toString()
                    return raw.json()
                })
                .then(res => {
                    console.log("Response received at", dataToAppend[0].ResTime)
                    if(res.Status.toLowerCase() != "ok" ||  !res.Result || !res.Result.searchImages || res.Result.searchImages.length == 0){
                        dataToAppend[0].Res = JSON.stringify(res)
                        console.log("Failed")
                        writer.writeRecords(dataToAppend)
                    }
                })
                .catch(ex => {
                    console.log(ex)
                    dataToAppend[0].Error = ex.message
                    writer.writeRecords(dataToAppend)
                })
            }, 10000 * (ind + 1))
        })
    }
})()