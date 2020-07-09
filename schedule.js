const fetch = require("node-fetch");
const cron = require("node-schedule");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'record.csv',
    header: [
        {id: 'Sno', title: 'SNo'},
        {id: 'ReqTime', title: 'Time Of Request'},
        {id: 'Req', title: 'Request'},
        {id: 'ResTime', title: 'Time of Response'},
        {id: 'Res', title: 'Response'},
        {id: 'Status', title: 'Status'}
    ]
});

const requests = [
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Bedroom%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Bathroom%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2040,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2030,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20bed:%202,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20269,%20bed:%202,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry,Bathroom,Bedroom,Elevation%20Front,Elevation%20Back%20Side,Patio,Exterior%20Others,Front%20Porch,townhomes,row%20homes,Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20133,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry,Bathroom,Bedroom,Elevation%20Front,Elevation%20Back%20Side,Patio,Exterior%20Others,Front%20Porch,townhomes,row%20homes,Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20133,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry,Bathroom,Bedroom,Elevation%20Front,Elevation%20Back%20Side,Patio,Exterior%20Others,Front%20Porch,townhomes,row%20homes,Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%2084,%20bed:%201,%20bath:%201,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry,Bathroom,Bedroom,Elevation%20Front,Elevation%20Back%20Side,Patio,Exterior%20Others,Front%20Porch,townhomes,row%20homes,Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20158,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry,Bathroom,Bedroom,Elevation%20Front,Elevation%20Back%20Side,Patio,Exterior%20Others,Front%20Porch,townhomes,row%20homes,Dining,Greatroom,Greatroom%20Combo,Greatroom%20Only,Media%20Room,Recreation%20Room,Study%20Room,Wet%20Bar,Closet,Dropzone,Empty,Foyer,Garage,Hallway,Interior%20Others,Laundry,Stairs%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20158,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20279,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%2071,%20city:%20%22Florida%20City%22,%20state:%20%22FL%22,%20sortFirstBy:%20%22{%27name%27:%27city%27,%27value%27:%27Florida%20City%27}%22,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%2071,%20city:%20%22Florida%20City%22,%20state:%20%22FL%22,%20sortFirstBy:%20%22{%27name%27:%27city%27,%27value%27:%27Florida%20City%27}%22,%20bed:%201,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`,
    `http://stage-hlapi.newhomesource.com/api/v3/graphQL?partnerId=&sessionToken=&query={%20searchImages(partnerId:%209383,%20minImgWidth:%20400,%20minImgHeight:%20300,%20sflow:%20500,%20sfhigh:%2010000,%20pageSize:%2022,%20page:%201,%20excludeBasiCommunities:%20true,%20client:%20%22HomLuv%22,%20marketId:%20275,%20imgType:%20%22ELE,INT%22,%20imgCat:%20%22Breakfast,Kitchen,Pantry%22,%20imgColorType:%20%22TrueColor%22)%20{%20id%20commId%20communityName%20planId%20planName%20listingId%20brHi%20homeId%20garageHi%20builderName%20baHi%20sftHi%20city%20state%20addr%20isSpec%20brand%20{%20id%20name%20logo%20logoSmall%20marketId%20state%20siteUrl%20}%20phone%20imageInfo%20{%20id%20path%20category%20objectLabels%20}%20prHi%20intImage%20thumb%20thumb2%20isBasic%20builderId%20county%20marketId%20marketName%20halfBa%20stories%20zip%20isLiked%20isSaved%20imageBookmarkDataId%20homeBookmarkDataId%20}%20}`
];


const j = cron.scheduleJob("*/10 * * * *", function(){
    JustDoIt();
});

let SnoCounter = 0;
function JustDoIt()
{
    for(let i = 0; i < requests.length; i++){
        setTimeout(function(){
            const url = requests[i];
            
            var dataToAppend = [{
                Sno: ++SnoCounter,
                Req: url,
                ReqTime: new Date().toString()
            }];
            fetch(url)
            .then(raw => {
                dataToAppend[0].Status = raw.status;
                dataToAppend[0].ResTime = new Date().toString()
                return raw.json();
            })
            .then(res => {
				console.log("Response received at", dataToAppend[0].ResTime);
                if(res.Status.toLowerCase() != "ok" ||  !res.Result || !res.Result.searchImages || res.Result.searchImages.length == 0){
                    dataToAppend[0].Res = JSON.stringify(res);
                    csvWriter.writeRecords(dataToAppend);
                }
            })
            .catch(ex => {
                console.log(ex);
                csvWriter.writeRecords(dataToAppend);
            });
        }, 10000 * (i + 1));
    }
}