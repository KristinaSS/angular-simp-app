// proxy-server.js
const http = require('http');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'https://cdn.merakianalytics.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/riot/lol/resources/latest/en-US'
  },
});

const server = http.createServer((req, res) => {
  proxy(req, res);
});

server.listen(3000);
