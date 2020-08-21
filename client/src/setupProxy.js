const config = require('../../config_client').get(process.env.NODE_ENV);
const { createProxyMiddleware } = require('http-proxy-middleware');

    
module.exports = function(app) {
    // app.use(createProxyMiddleware("/api/", { target: "http://localhost:3001/" }))
    app.use(createProxyMiddleware("/api/", { target: `http://${config.IP_ADDRESS}:3001/` }))
}