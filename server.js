// Dependencies
var http = require("http");
const os = require('os');
var fs = require('fs-extra');
var path = require('path');
var zip = new JSZip();

var PORT = process.env.PORT || 8080;

var server = http.createServer(handleRequest);

function handleRequest (req, res) {
    var path = req.url;
    switch (path) {
        case "/api":
            return writeFiles(req, res);
        default:
            return renderWelcomePage(req, res);
    }
}

function renderWelcomePage (req, res) {
    fs.readFile(__dirname + "/index.html", function (err, data) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("<html><head><title>Oops</title></head><body><h1>Oops, there was an error</h1></html>");
        }
        else {
            // We then respond to the client with the HTML page by specifically telling the browser that we are delivering
            // an html file.
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        }
    });
}

function writeFiles (req, res) {
    setTimeout(function () {
        let requestData = '';
        req.on("data", function (data) {
            requestData += data;
            theShortFileName = JSON.parse(requestData).body;
            console.log("Creating directory and moving files for: ", theShortFileName);
            var readFileListFile = `/Users/desmondmullen/Downloads/filelist.xml`
            var readHeaderFile = `/Users/desmondmullen/Downloads/header.html`
            var writeFileListFile = `/filelist2.xml`
            var writeHeaderFile = `/header2.html`
            // var writeFileListFile = `/Users/desmondmullen/Downloads/${theShortFileName}.fld/filelist.xml`
            // var writeHeaderFile = `/Users/desmondmullen/Downloads/${theShortFileName}.fld/header.html`

            // fs.appendFile(writeFileListFile, 'Hello content!', function (err) {
            //     if (err) throw err;
            //     console.log('Saved!');
            zip.file("Hello.txt", "Hello World\n");

            var img = zip.folder("images");
            img.file("smile.gif", imgData, { base64: true });

            zip.generateAsync({ type: "blob" }).then(function (content) {
                // see FileSaver.js
                saveAs(content, "example.zip");
            });
        });
        renderWelcomePage(req, res)
    }, 3000);
}

// Starts our server.
server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
