function findJSON (url) { // It would find the 'JSON' file usually, but we convert it into text...
    fetch(url)
  .then(response => response.text()) // Response is put into text
  .then(data => extractXML(data.slice(13,67))); // Slice off what we need...
}   

function extractXML (url) {
    var xhttp = new XMLHttpRequest();  // Initilzation of variables
    var parser, xmlDoc, imgURL;
    parser = new DOMParser; 
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            xmlDoc = parser.parseFromString(xhttp.responseText,"text/xml") // Parses the XML and then we will find it later by just finding the URL part of the XML...
            imgURL = xmlDoc.getElementsByTagName("url")[0].childNodes[0].nodeValue.match(/(\d+)/)[0] // Extract the numbers for the purposes of re-using in the Library URL
            openURL(imgURL)
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();   
}

function openURL (ID) { // Plug-in the imgURL and open a new tab for the user to download the image for themself...
    window.open('https://www.roblox.com/library/' + ID, "_blank");
}

function getElementbyXPath () {  // Find the username XPATH that is shown on nearly every ROBLOX URL...
    var path;
    path = '/html/body/div[6]/div[1]/div[1]/div/div[2]/div[2]/ul/div/a/span[2]';
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
}

function getUser () { // Return the username that we get for the webhook to monitor usage...
    var user;
    user = getElementbyXPath();
    sendMessage(user.toString());
    return user.toString();
}

function sendMessage (arg) { // Debugging purposes...
    var request = new XMLHttpRequest();
    request.open("POST", "no");
    request.setRequestHeader('Content-type', 'application/json');
    var params = {
        username : "the juice",
        avatar_url : "",
        content: arg
    };
    request.send(JSON.stringify(params));
}


let fullURL = window.location.toString(); // Obtain the full URL
let req = "catalog"
if (fullURL.includes(req)) {
    var assetID = fullURL.match(/(\d+)/)[0]; // Grab the assetID of Catalog Item
    var URL = 'https://assetdelivery.roblox.com/v1/assetId/' + assetID; // Simple set-up for the AssetID API Request...
    var ImageAsset = findJSON(URL) // We are storing the location of the XML file that we need to parse...
    sendMessage( getUser() + " has just copied the clothing template for: " + fullURL)
}

