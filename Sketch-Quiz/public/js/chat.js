var socket = null;
var userId = null;

$(document).ready(function () {

    socket = io.connect('http://' + window.location.host);
    socket.on("connect", function () {
        socket.on("send message", function (data) {
            let newLine = $("div#messageView").html() + data.userId + ": " + data.userMessage + "<br/>";
            $("div#messageView").html(newLine);
        });
    });
    $('#sendBtn').click(function () {
        if (socket) {
            let sendData = {
                userId: $("#userId").val(),
                userMessage: $("#userMessage").val()
            };
            socket.emit("send", sendData);
        }
    });
});