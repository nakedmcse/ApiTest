import Waifuvault from "waifuvault-node-api";

// Main Program
const responses = await uploadTest();
await infoTest(responses);
await downloadTest(responses);
await deleteTest(responses);

// Sleep function
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Uploads
async function uploadTest() {
    console.log("UPLOAD FILES TEST");
    const respURL = await Waifuvault.uploadFile({
        url: "https://twistedsisterscleaning.walker.moe/assets/sunflowers.png"
    });
    console.log("URL Upload", respURL.url);
    await sleep(1000);

    const respFile = await Waifuvault.uploadFile({
        file: "./MargeryDaw.png"
    });
    console.log("File Upload",respFile.url);
    await sleep(1000);

    const respMonty = await Waifuvault.uploadFile({
        file: "./RoryMercury.png",
        expires: "1d",
        hideFilename: true,
        password: "dangerWaifu"
    });
    console.log("Encrypted Hidden File Upload",respMonty.url);
    await sleep(1000);

    return [respURL,respFile,respMonty];
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
async function downloadTest(responses) {
    console.log("\nDOWNLOAD TEST");
    const fileURL = await Waifuvault.getFile({
        token: responses[0].token
    });
    console.log("URL File Buffer");
    console.log(fileURL);
    await sleep(1000);

    const file = await Waifuvault.getFile({
        token: responses[1].token
    });
    console.log("File Buffer");
    console.log(file);
    await sleep(1000);

    const fileMonty = await Waifuvault.getFile({
        token: responses[2].token,
        password: "dangerWaifu"
    });
    console.log("Hidden Encrypted Buffer");
    console.log(fileMonty);
    await sleep(1000);
}