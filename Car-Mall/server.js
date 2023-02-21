const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();

const login = require("./js/login.js");
const admin = require("./js/admin.js");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

process.env.PORT = 3001;
app.set('port', 3001);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", admin);
app.use("/login", login);


const carList = [];

router.route("/car").get((req, res) => {
    console.log("GET - /car");
    req.app.render("car", { carList }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        res.end(data);
    });
});

router.route("/car").post((req, res) => {
    console.log("POST - /car");
    res.redirect("/car");
});

router.route("/car/buy").get((req, res) => {
    console.log("GET - /car/buy");
    let no = req.query.no;

    let index = carList.findIndex((item, i) => {
        return item.no == no;
    });
    if (index != -1) {
        carList[index].state = "예약중";
    }
    res.redirect("/car");
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

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log("Node.js 서버 실행 중 ... http://localhost:" + app.get('port'));
});