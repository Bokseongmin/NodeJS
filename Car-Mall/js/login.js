const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
    console.log("GET - /login");
    req.app.render((err, data) => {
        if (err) throw err;
        res.end(data);
    });
});

router.route("/").post((req, res) => {
    console.log("POST - /login");

    var getCompany = req.body.company;
    var getTitle = req.body.title;
    var getYear = req.body.year;
    var getPrice = req.body.price;
    var getState = "대기중";

    carList.push({ no: seqCar++, company: getCompany, title: getTitle, year: getYear, price: getPrice, state: getState });

    res.redirect("/");
});

module.exports = router;