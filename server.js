// Dependencies
var http = require("http");
// var fs = require("fs");

var fs = require('fs-extra');

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
    let requestData = '';
    req.on("data", function (data) {
        requestData += data;
        theShortFileName = JSON.parse(requestData).body;
        console.log("Creating directory and moving files for: ", theShortFileName);
        var readFileListFile = `/Users/desmondmullen/Downloads/filelist.xml`
        var readHeaderFile = `/Users/desmondmullen/Downloads/header.html`
        var writeFileListFile = `/Users/desmondmullen/Downloads/${theShortFileName}.fld/filelist.xml`
        var writeHeaderFile = `/Users/desmondmullen/Downloads/${theShortFileName}.fld/header.html`

        try {
            if (!fs.existsSync(`/Users/desmondmullen/Downloads/${theShortFileName}.fld`)) {
                fs.mkdirSync(`/Users/desmondmullen/Downloads/${theShortFileName}.fld`)
            }
        } catch (err) {
            console.error(err)
        }

        setTimeout(function () {
            var oldPath = readFileListFile
            var newPath = writeFileListFile
            fs.rename(oldPath, newPath, function (err) {
                if (err) throw err
                console.log('moved filelist.xml')
            })
            oldPath = readHeaderFile
            newPath = writeHeaderFile
            fs.rename(oldPath, newPath, function (err) {
                if (err) throw err
                console.log('moved header.html')
            })
        }, 3000);

    });
    renderWelcomePage(req, res)
}

// Starts our server.
server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
