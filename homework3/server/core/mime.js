import * as fs from "fs";
import * as zlib from "zlib";

const mime = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "json": "application/json",
    "gif": "image/gif",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "webm": "video/webm",
    "mp4": "video/mp4"

};

const handleStatic = (req, res, pathname, ext) => {
    fs.exists(pathname, exists => {
        if (!exists) {
            console.log('not exist');
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write(`The request url ${pathname} was not found on this server`);
            res.end();
        } else {
            console.log(ext);
            // if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'ico' || ext === 'gif') {
            // 缓存静态图片资源
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            // }
            let acceptEncoding = req.headers['accept-encoding']; //取得浏览器的accept-encoding头，询问支持哪种压缩
            if (acceptEncoding && acceptEncoding.match(/\bgzip\b/)) { //浏览器支持gzip格式
                res.setHeader('Content-Encoding', 'gzip'); //告知浏览器发送的数据是gzip压缩格式
                let gzip = zlib.createGzip();
                fs.createReadStream(pathname).pipe(gzip).pipe(res); //压缩后输出
            } else if (acceptEncoding && acceptEncoding.match(/\bdeflate\b/)) { //浏览器支持deflate格式
                let deflate = zlib.createDeflate();
                res.setHeader('Content-Encoding', 'deflate');
                fs.createReadStream(pathname).pipe(deflate).pipe(res); // 压缩后输出
            } else {
                fs.createReadStream(pathname).pipe(res);
            }

            // fs.readFile(pathname, ((err, data) => {
            //     if (err) {
            //         res.writeHead(500, {'Content-Type': 'text/plain'});
            //         res.end(err);
            //     } else {
            //         const contentType = mime[ext] || 'text/plain';
            //         res.writeHead(200, {'Content-Type': contentType});
            //         res.write(data);
            //         res.end();
            //     }
            // }));
        }
    });
};

export {handleStatic};
