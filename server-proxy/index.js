// // node index.js "https://s02183gc-3000.use2.devtunnels.ms" "http://proxy.glb.mapfre.net:80"

const { socket } = require("./socket");
const { Controller } = require("./controller");
const { executeQuery } = require("./database");
const { decrypt } = require("./crypto");
const fs = require("fs");

socket.on("connect", () => {
  console.log("Connected to WebSocket server!");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server.");
});

socket.on("connect_error", (error) => {
  console.error("Connection Error:", error.message);
});

socket.on("message", async (payload) => {
  try {
    const controller = Controller.from(payload);

    controller.on("oracle.query", async (data) => {
      const config = JSON.parse(JSON.parse(decrypt(data.config)));
      return await executeQuery(config, data.query);
    });

    controller.on("public.key", async () => {
      return fs.readFileSync("public.pem", "utf8");
    });
  } catch (ex) {
    console.error(ex);
  }
});

console.log("Attempting to connect to the WebSocket server...");
