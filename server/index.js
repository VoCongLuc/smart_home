const MQTT = require('./MQTT');

const express = require('express');
const app = express()
const port = 3000

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let sockets = [];

io.on('connection', (socket) => { 
  sockets.push(socket);
  socket.on("disconnect", () => sockets = sockets.filter(s => s.id !== socket.id))
});

MQTT.subscribe("nhietdo");

MQTT.on("message", (topic, payload) => {
  console.log({topic, payload: payload.toString()})
 
  io.emit("temp", payload.toString())
})

app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  req.luc = "ABC";
  next();
})


app.get('/home', (req, res) => {
  res.render('layout', {content: 'home', data: {}})
})

app.get('/devices', (req, res) => {
  // get data tu db
  let devices = [
    {
      id: 1,
      name: "Den phong ngu",
      status: true
    },
    {
      id: 2,
      name: "Den phong khach",
      status: false
    },
    {
      id: 3,
      name: "Quat tran",
      status: true
    }
  ]
  res.render('layout', {
    content: 'devices', 
    data: {
      devices
    }
  })
})

app.get('/batden', (req, res)=> {
    MQTT.publish("DEN", "batden")
    res.send("Bat den")
})

app.get('/tatden', (req, res)=> {
    MQTT.publish("DEN", "tatden")
    res.send("Tat den")
})

app.get('/batdenphongngu', (req, res)=> {
  MQTT.publish("DEN", "batden")
  res.send("Bat den")
})

app.get('/tatdenphongngu', (req, res)=> {
  MQTT.publish("DEN", "tatden")
  res.send("Tat den")
})

app.post("/den", (req, res) => {
  console.log("Luc", req.luc)
  console.log("Body:", req.body)
  MQTT.publish("DEN", JSON.stringify(req.body))
  res.json(req.body)
})

server.listen(port);