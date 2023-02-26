module.exports = function (router, app) {
    router.route("/").get((req, res) => {
        const session = req.session.user;
        const db = app.get("db");
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
        if (db) {
            const car = db.collection("car");
            car.find({}).toArray(function (findErr, carList) {
                if (findErr) throw err;
                mainData.carList = carList;
                req.app.render("main", mainData, function (err, data) {
                    if (err) throw err;
                    res.end(data);
                });
            });
            console.log("main 출력");
        } else {
            res.render("main", mainData);
        }
    });

    router.route("/car/buy").get((req, res) => {
        console.log("GET - /car/buy");
        const db = app.get("db");
        const no = parseInt(req.query.no);
        const customer = req.query.name;

        if(db) {
            const car = db.collection("car");
            car.updateOne({ no: no }, { $set: { state: "예약중", customer: customer } }, function (findErr, result) {
                if (findErr) throw err;
            });
            res.redirect("/");
        } else {
            console.log("DB가 존재하지 않습니다.");
        }
    });

    router.route("/sign/out").get((req, res) => {
        console.log("GET - /sign/out");
        req.session.user = null;
        res.redirect("/sign/in");
        console.log("GET - /sign/out 종료");
    });
}