const express = require('express')
const moment = require('moment')
const { create_question, get_questions, shuffle } = require("../db.js");


const router = express.Router()

function protected_route(req, res, next) {
    if (!req.session.user) {
        // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
        return res.redirect('/login')
    }
    next()
}

// RUTAS
router.get('/', protected_route, async(req, res) => {

    res.render("index.html");
})

router.get("/addQuestion", protected_route, async(req, res) => {

    res.render("add_question.html");
});

router.post("/addQuestion", async(req, res) => {
    let user_id = req.session.user.id;
    console.log(req.session.user.id);
    let pregunta = req.body.pregunta;
    let correcta = req.body.correcta;
    let incorrectaUno = req.body.incorrectaUno;
    let incorrectaDos = req.body.incorrectaDos;

    await create_question(user_id, pregunta, correcta, incorrectaUno, incorrectaDos);
    //  console.log(user_id, pregunta, correcta, incorrectaUno, incorrectaDos);
    res.render("add_question.html");
});


router.get("/jugar", protected_route, async(req, res) => {
    let preguntas = await get_questions();
    console.log(preguntas);
    let nuevoObjeto = [];
    for (let pregunta of preguntas) {
        let array1 = [];
        let obj1 = {};

        array1.push(pregunta.respcorrecta);
        array1.push(pregunta.respincorrecta01);
        array1.push(pregunta.respincorrecta02);
        shuffle(array1);
        obj1 = {
            id: pregunta.id,
            question: pregunta.question,
            p1: array1[0],
            p2: array1[1],
            p3: array1[2],
        };
        nuevoObjeto.push(obj1);
    }
    console.log(nuevoObjeto)
    res.render("jugar.html", { nuevoObjeto });
});



module.exports = router