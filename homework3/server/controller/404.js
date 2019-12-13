export default (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page Not Found!\n');
};