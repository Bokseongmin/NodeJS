var ctx;
var socket;
var drawColor = "White";
var drawWidth = "2";

var msg = {
    line: {
        send: function (type, x, y) {
            socket.emit("linesend", { "type": type, "x": x, "y": y, "color": drawColor, "width": drawWidth });
        }
    }
};

// 그리기 부분에 대한 설정
var draw = {
    drawing: false,
    start: function (e) {
        this.drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
        msg.line.send("start", e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
    },
    move: function (e) {
        if (this.drawing === true) {
            ctx.lineTo(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = drawWidth;
            ctx.stroke();

            msg.line.send("move", e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
        }
    },
    end: function (e) {
        this.drawing = false;
        $("#cv").bind("mousemove", null);

        msg.line.send("end");
    },
    clear: function (e) {
        ctx.clearRect(0, 0, cv.width, cv.height);

        msg.line.send("clear");
    },
    drawfromServer: function (data) {
        if (data.type == "start") {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.width;
        }
        if (data.type == "move") {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        }
        if (data.type == "end") {

        }
        if (data.type == "clear") {
            ctx.clearRect(0, 0, cv.width, cv.height);
        }
    }
};

var color_map = [
    { "value": "red", "name": "빨간색" },
    { "value": "orange", "name": "주황색" },
    { "value": "blue", "name": "파랑색" },
    { "value": "black", "name": "검은색" },
    { "value": "white", "name": "하얀색" }
];

function init() {
    if (!socket) return;
    draw.drawing = false;
    $("#cv").on("mousedown", draw.start);
    $("#cv").on("mousemove", draw.move);
    $("#cv").on("mouseup", draw.end);
    $("#clearBtn").bind("click", draw.clear);

    $("#colorBtn button").click(function (e) {
        drawColor = $(this).attr("data-color");
    });

    socket.on("linesend_tocllinet", function (data) {
        draw.drawfromServer(data);
    });
}

$(document).ready(function () {
    ctx = $("#cv")[0].getContext("2d");

    // Canvas 사이즈 변경
    $("#cv").attr("width", "500px");
    $("#cv").attr("height", "500px");

    $("#connectBtn").click(function () {
        if ($("#userId").val() === "") {
            alert("ID를 작성해주세요");
            $("#userId").focus();
        } else {
            socket = io.connect('http://' + window.location.host);

            socket.emit("login", {
                userId : userId,
                userMessage : $("#userMessage").val()
            });
            init();
        }
    });

    $("#closeBtn").click(function () {
        if (socket) {
            socket.close();
            $("#cv").off("mousedown");
        }
    });
});