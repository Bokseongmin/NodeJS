const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = express.Router();
const { MongoClient } = require('mongodb');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require("multer");

process.env.PORT = 3000;
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(session({
    secret: "my key",
    resave: true,
    saveUninitialized: true
}));

app.use("/uploads", express.static(__dirname + "/uploads"));

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads");
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
    }
});

let upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

app.set("upload", upload)

const uri = "mongodb://127.0.0.1";
const client = new MongoClient(uri, { useUnifiedTopology: true });
let db = null;
let localDB = null;
async function connectDB() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Establish and verify connection
        db = await client.db("vehicle");
        localDB = await client.db("local");
        app.set("db", db);
        app.set("localDB", localDB);
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}

///////--------------------------------
const main = require("./routes/main");
const login = require("./routes/sign");
const admin = require("./routes/admin");
const { UPDATE } = require("mongodb/lib/bulk/common");
main(router, app)
login(router, app);
admin(router, app);

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
    console.log("http://localhost:" + app.get("port"));
    console.log("Node.js 서버 실행 중 ...");
    connectDB().catch(console.dir);
});