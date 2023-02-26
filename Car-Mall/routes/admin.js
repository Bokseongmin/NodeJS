module.exports = function (router, app) {
    const upload = app.get("upload");
    let carSeq;

    // 접근 권한 확인
    router.use("/admin", (req, res, next) => {
        if(req.session.user == null || req.session.user.lv != 0) res.redirect("/");
        else next();
    });

    router.route("/admin").get((req, res) => {
        console.log("GET - /admin");
        const db = app.get("db");
        const localDB = app.get("localDB");

        if (db) {
            const car = db.collection("car");
            car.find({}).toArray(function (findErr, carList) {
                if (findErr) throw err;
                req.app.render("admin", { carList }, (err, data) => {
                    if (err) throw err;
                    res.end(data);
                });
            });

            // 내림차순을 이용하여 데이터를 정렬 후 마지막 no 추출
            car.find().sort({ no: -1 }).limit(1).toArray((err, result) => {

                // 프로젝션(projection) 연산자 사용 result[0]
                carSeq = parseInt(result[0].no);
            });
        } else {
            res.render("admin", carList);
        }
    });

    router.route("/admin/car/add").post(upload.single("pic"), (req, res) => {
        console.log("POST - /admin/car/add");
        const db = app.get("db");

        const company = req.body.company;
        const name = req.body.name;
        const year = req.body.year;
        const price = req.body.price;

        // 이미지 파일이 저장된 위치
        const pic = req.file.path;

        const carData = {
            no: ++carSeq,
            company: company,
            name: name,
            year: year,
            price: price,
            state: "대기중",
            pic: pic
        };

        if (db) {
            const car = db.collection("car");
            car.insertOne(carData, function (err, result) {
                if (err) throw err;
                console.log("차량 정보 저장완료");
                res.redirect("/admin");
            });
        } else {
            console.log("DB가 존재하지 않습니다.");
        }
    });

    router.route("/admin/car/state").get((req, res) => {
        console.log("GET - /admin/car/state");

        const db = app.get("db");
        const no = parseInt(req.query.no);
        const state = req.query.state;

        if (db) {
            const car = db.collection("car");
            car.updateOne({ no: no }, { $set: { state: state, customer: "" } }, function (findErr, result) {
                if (findErr) throw err;
            });
            res.redirect("/admin");
        } else {
            console.log("DB가 존재하지 않습니다.");
        }
    });

    router.route("/admin/car/modify").get((req, res) => {
        console.log("GET - /admin/car/modify >>> " + req.query.no);
        const db = app.get("db");

        let no = parseInt(req.query.no);
        let company = req.query.company
        let name = req.query.name;
        let year = parseInt(req.query.year);
        let price = parseInt(req.query.price);
        let customer = req.query.customer;

        if (db) {
            const car = db.collection("car");
            car.updateOne({ no: no }, { $set: { company: company, name: name, year: year, price: price, customer: customer } }, function (findErr, result) {
                if (findErr) throw err;
            });
            res.redirect("/admin");
        } else {
            console.log("DB가 존재하지 않습니다.");
        }
    });

    router.route("/admin/car/delete").get((req, res) => {
        console.log("GET - /admin/car/delete");

        const db = app.get("db");
        const no = parseInt(req.query.no);

        if (db) {
            const car = db.collection("car");
            car.deleteOne({ no: no });
        }

        res.redirect("/admin");
    });

}