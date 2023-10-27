const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("Connect mqtt thanh cong!");
});

module.exports = client