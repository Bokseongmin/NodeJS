var ctx;
var socket;
var drawColor = "White";
var drawWidth = "2";

var msg = {
    line: {
        send: function (type, x, y) {
            socket.emit('linesend', { 'type': type, 'x': x, 'y': y, 'color': drawColor, 'width': drawWidth });
        }
    }
}

// 그리기 부분에 대한 설정
var draw = {
    drawing: false,
    start: function (e) {
        this.drawing = true;

        ctx.beginPath();
        ctx.moveTo(e.pageX, e.pageY);

        msg.line.send('start', e.pageX, e.pageY);
    },
    move: function (e) {
        if (this.drawing === true) {
            ctx.lineTo(e.pageX, e.pageY);
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = drawWidth;
            ctx.stroke();

            msg.line.send('move', e.pageX, e.pageY);
        }
    },
    end: function (e) {
        this.drawing = false;
        $('#canvas').bind('mousemove', null);

        msg.line.send('end');
    },
    clear: function (e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        msg.line.send('clear');
    },
    drawfromServer: function (data) {
        //console.log(data.type);
        if (data.type == 'start') {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.width;
        }
        if (data.type == 'move') {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        }
        if (data.type == 'end') {
            
        }
        if (data.type == 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

$(document).ready(function () {
    ctx = $('#canvas')[0].getContext('2d');

    // Canvas 사이즈 변경
    $('#canvas').attr('width', '500px');
    $('#canvas').attr('height', '500px');

    draw.drawing = false;
    $('#canvas').on('mousedown', draw.start);
    $('#canvas').on('mousemove', draw.move);
    $('#canvas').on('mouseup', draw.end);
    $('#clear').bind('click', draw.clear);

    // socket 전역 설정 - 서버 URL 동적 사용
    socket = io.connect('http://' + window.location.host);
    //console.log(window.location.host);

    socket.on('linesend_tocllinet', function (data) {
        //console.log(data);
        draw.drawfromServer(data);
    });
});