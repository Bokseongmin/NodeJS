module.exports = function (router, app) {
    router.route("/sign/in").get((req, res) => {
        console.log("GET - /sign/in");
        const session = req.session.user;

        let mainData = {
            name: false,
            lv: false
        };

        if (session) {
            mainData = {
                name: session.name,
                lv: session.lv
            };
        }
        req.app.render("sign/in", mainData, function (err, data) {
            if (err) throw err
            res.end(data);
        });
    });

    router.route("/sign/in").post((req, res) => {
        console.log("POST - /sign/in");

        const localDB = app.get("localDB");

        const userId = req.body.userId;
        const passwd = req.body.passwd;

        if (localDB) {
            let users = localDB.collection("users").findOne({ id: userId, passwd: passwd }, function (err, result) {
                if (err) throw err;
                if (result) {
                    //session에 정보를 저장하고 이동...
                    req.session.user = {
                        id: userId,
                        name: result.name,
                        lv: result.lv
                    }
                    res.redirect("/");
                } else {
                    console.log("불일치");
                    res.redirect("/sign/in");
                }
            });
        } else {
            console.log("localDB가 존재하지 않습니다.");
        }
    });

    router.route("/sign/up").get((req, res) => {
        console.log("GET - /sign/up");
        req.app.render("sign/up", function (err, data) {
            if (err) throw err
            res.end(data);
        });
    });

    router.route("/sign/up").post((req, res) => {
        console.log("GET - /sign/up");

        const localDB = app.get("localDB");

        const name = req.body.name;
        const age = parseInt(req.body.age);
        const userId = req.body.userId;
        const passwd = req.body.passwd;

        const userData = {
            name: name,
            age: age,
            id: userId,
            passwd: passwd,
            lv: 1
        }

        if (localDB) {
            let users = localDB.collection("users").insertOne(userData, function (err, result) {
                if (err) throw err;
                console.log("사용자 정보 저장완료");
                res.redirect("/sign/in");
            });
        } else {
            console.log("localDB가 존재하지 않습니다.");
        }
    });

    router.route("/sign/out").get((req, res) => {
        console.log("GET - /sign/out");
        req.session.user = null;
        res.redirect("/sign/in");
    });
}