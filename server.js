
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var express = require("express");
var fs = require('fs');
var app = express();
var cors = require("cors");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const controller = require("./controllers/mycontrollers").controller;
const router = require("./apis");

gameSocket = null;
let sockets = [];
app.use(express.static('public'));
app.use(cors({
    origin: '*'
}));


app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.options("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.send(200);
});

app.use("/api", router);

const frontEndPath = __dirname + "/../Run_dog_frontend/build";

const { connectDB } = require("./db");
db = connectDB();

global.sql = db;

const blockchainHandle = require("./blockchainApis");
blockchainHandle();

setInterval(() => {
    if (sockets.length > 0) {
        sockets.map((_socket) => {
            controller.emit(_socket);
        });
    }
}, 500);

// Implement socket functionality
gameSocket = io.on("connection", (socket) => {
    console.log("socket connected: " + socket.id);
    socket.on("disconnect", function () {
        console.log("disconnected");
        controller.disconnect(socket.id);
        sockets = sockets.filter((_socket) => {
            socket.id != _socket.id;
        });
        console.log(...sockets);
        console.log(sockets.length);
    });

    socket.on("login", async (data, callback) => {
        console.log("login", data);
        try {
            var r = await controller.socketLogin(data, socket.id);
            if (r.success == 1) {
                sockets.push(socket);
                callback({
                    status: 1,
                    user: r.user
                });
            }
            if (r.success == 2) {
                callback({
                    status: 2,
                    error: "please register"
                });
            }

        } catch (err) {
            callback({
                status: -1,
                error: err.message
            });
        }
    });

    socket.on("register", async (data, callback) => {
        console.log("register", data);
        try {
            var r = await controller.socketRegister(data, socket.id);
            if (r.success == 1) {
                sockets.push(socket);
                callback({
                    status: 1,
                    user: r.user
                });
            }
        } catch (err) {
            callback({
                status: -1,
                error: err.message
            });
        }
    });

    socket.on("startGame", async (data, callback) => {
        try {
            let user = await controller.startGame(data, socket.id);
            callback({
                status: 1,
                user: user
            });
        } catch (err) {
            console.log("startGame err", err.message);
            callback({
                status: -111,
                err: err.message
            })
        }
    });

    socket.on("addCoin", async (data, callback) => {
        try {
            let user = await controller.collectCoin(data, socket.id);
            callback({
                status: 1,
                user: user
            });
        } catch (err) {
            callback({
                status: -111,
                err: err.message
            })
        }
    });

    socket.on("addGold", async (data, callback) => {
        try {
            let user = await controller.collectGold(data, socket.id);
            callback({
                status: 1,
                user: user
            });
        } catch (err) {
            callback({
                status: -111,
                err: err.message
            })
        }
    });
});

app.use(express.static(frontEndPath));
app.get('/*', (req, res)=>{
    const html = fs.readFileSync(frontEndPath + '/index.html').toString('utf8')
    res.send(html);
});
server.listen(80, () => console.log(`Server running on port ${80}`));