import Waifuvault from "waifuvault-node-api";

// Tests
const tests = [
    {filename:undefined,hideName:false,password:undefined,expires:undefined,url:'https://twistedsisterscleaning.walker.moe/assets/sunflowers.png'},
    {filename:'./MargeryDaw.png',hideName:false,password:undefined,expires:undefined,url:undefined},
    {filename:'./RoryMercury.png',hideName:true,password:"dangerWaifu",expires:"1d",url:undefined},
];

// Main Program
const responses = await uploadTest(tests);
await infoTest(responses);
await downloadTest(responses,tests);
await deleteTest(responses);

// Sleep function
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Uploads
async function uploadTest(tests) {
    const responses = [];
    console.log("UPLOAD FILES TEST");
    for(const test of tests) {
        const resp = await Waifuvault.uploadFile({
            ...(test.filename) && {file: test.filename},
            ...(test.url) && {url: test.url},
            ...(test.expires) && {expires: test.expires},
            ...(test.hideName) && {hideFilename: test.hideName},
            ...(test.password) && {password: test.password}
        });
        console.log("File Upload",resp.url,resp.token);
        responses.push(resp);
        await sleep(1000);
    }
    return responses;
}

// Infos
async function infoTest(responses) {
    console.log("\nGET INFO TEST")
    for(const resp of responses) {
        const info = await Waifuvault.fileInfo(resp.token, true);
        console.log("File retention",info.retentionPeriod,"URL",info.url,"Encrypted",info.protected);
        await sleep(1000);
    }
}

// Deletes
async function deleteTest(responses) {
    console.log("\nDELETE TEST")
    for(const resp of responses) {
        const del = await Waifuvault.deleteFile(resp.token);
        console.log("Delete",resp.url,del);
        await sleep(1000);
    }
}

// Downloads
async function downloadTest(responses,tests) {
    console.log("\nDOWNLOAD TEST");
    for(let i=0; i<responses.length; i++) {
        const fileURL = await Waifuvault.getFile({
            token: responses[i].token,
            ...(tests[i].password) && {password: tests[i].password}
        });
        console.log("File Buffer",fileURL.length,tests[i].filename ?? tests[i].url);
        await sleep(1000);
    }
}