
const express = require("express");
const router = express.Router();
const controller = require("../controllers/mycontrollers").controller;

router.get("/get-histories", async (req, res) => {
    try {
        var histories = await controller.getHistories();
        res.json({
            data: histories
        });
    } catch (err) {
        res.json({
            data: [],
            error: true,
            message: "Get histories Error."
        });
        console.log("get-histories error: ", err.message);
    }
})

router.get("/get-players", async (req, res) => {
    try {
        var Scores = await controller.getScores();
        console.log(Scores);
        res.json({
            data: Scores
        });
    } catch (err) {
        res.json({
            data: [],
            error: true,
            message: "Get players Error."
        });
        console.log("get-histories error: ", err.message);
    }
})
module.exports = router;