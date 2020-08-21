// const proxy = require('http-proxy-middleware')
const { createProxyMiddleware } = require('http-proxy-middleware');

    
module.exports = function(app) {
    app.use(createProxyMiddleware("/api/", { target: "http://64.227.34.134:3001/" }))
}