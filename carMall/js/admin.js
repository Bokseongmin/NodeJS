const express = require("express");
const router = express.Router();

const carList = [];

router.route("/").get((req, res) => {
    console.log("GET - /admin");
    req.app.render("admin", { carList }, (err, data) => {
        if (err) throw err;
        res.end(data);
    });
});

router.route("/").post((req, res) => {
    console.log("POST - /admin");

    var getCompany = req.body.company;
    var getTitle = req.body.title;
    var getYear = req.body.year;
    var getPrice = req.body.price;
    var getState = "대기중";

    carList.push({ no: seqCar++, company: getCompany, title: getTitle, year: getYear, price: getPrice, state: getState });

    res.redirect("/");
});

router.route("/state").get((req, res) => {
    console.log("GET - /admin/state");
    let no = req.query.no;
    let state = req.query.state;

    let index = carList.findIndex((item, i) => {
        return item.no == no;
    });
    if (index != -1) {
        carList[index].state = state;
    }
    res.redirect("/");
});

router.route("/modify").get((req, res) => {
    console.log("GET - /modify >>> " + req.query.no);
    let no = req.query.no;
    let company = req.query.company
    let title = req.query.title;
    let year = req.query.year;
    let price = req.query.price;

    let index = carList.findIndex((item, i) => {
        return item.no == no;
    });

    if (index != -1) {
        carList[index].company = company;
        carList[index].title = title;
        carList[index].year = year;
        carList[index].price = price;
    }
    res.redirect("/");
});

router.route("/delete").get((req, res) => {
    console.log("GET - /delete");
    let no = req.query.no;

    let index = carList.findIndex((item, i) => {
        return item.no == no;
    });
    if (index != -1) {
        carList.splice(index, 1);
    }
    res.redirect("/");
});

module.exports = router;