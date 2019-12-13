import * as fs from "fs";

const mime = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "json": "application/json",
    "gif": "image/gif",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png"
};

const handleStatic = (res, pathname, ext) => {
    fs.exists(pathname, exists => {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write(`The request url ${pathname} was not found on this server`);
            res.end();
        } else {
            fs.readFile(pathname, ((err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end(err);
                } else {
                    const contentType = mime[ext] || 'text/plain';
                    res.writeHead(200, {'Content-Type': contentType});
                    res.write(data);
                    res.end();
                }
            }));
        }
    });
};

export {handleStatic};
