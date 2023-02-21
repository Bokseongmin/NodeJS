const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();

// 소켓io
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

process.env.PORT = 3000;
app.set("port", process.env.PORT || 3001);

app.use(cors());
app.use(express.static(__dirname + "/public"));

/////// router -------
// 접속한 소켓을 저장하는 객체 준비
const clientSocketMap = {};
// 클라이언트가 socket으로 접속하면 실행
io.sockets.on("connection", (socket) => {
    console.log("소켓으로 접속 됨.");

    socket.on('linesend', function (data) {
        socket.broadcast.emit('linesend_tocllinet', data);
    });

    socket.on("login", function (data) {
        data.socketId = socket.id;
        clientSocketMap[data.userId] = data;
    });

    socket.on("send", function (data) {
        io.sockets.emit("send message", data);
        console.log(data);
        return;
    });

    socket.on("disconnect", function () {
        console.log("/chat 클라이언트 접속이 해제 됨.");
    });
});

app.use("/", router);
/////// error handler -----
var expressErrorHandler = require('express-error-handler');
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

server.listen(app.get("port"), () => {
    console.log("Node.js 서버 실행 중 ... http://localhost:" + app.get("port"));
});