// socket.js
const { io } = require("socket.io-client");
const { HttpsProxyAgent } = require("https-proxy-agent");

const args = process.argv;
const serverUrl = args[2];
const proxy = args[3];

if (!serverUrl) {
  console.error("serverUrl missing");
}

let agent = undefined;
if (proxy) {
  agent = new HttpsProxyAgent(proxy);
}

// Pass the agent in the options object of the io() function
const socket = io(serverUrl, {
  agent: agent,
});

module.exports = { socket };
