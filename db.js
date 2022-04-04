const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'trivia_game',
    password: '1234',
    max: 12,
    min: 2,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 2000
})
async function create_user(name, email, password) {
    const client = await pool.connect();
    const { rows } = await client.query(`select * from users `);
    if (rows.length > 0) {
        await client.query({
            text: "insert into users (name, email, password,es_admin) values ($1, $2, $3, false)",
            values: [name, email, password],
        });
    } else {
        await client.query({
            text: "insert into users (name, email, password,es_admin) values ($1, $2, $3,true)",
            values: [name, email, password],
        });
    }
    client.release();
}

async function get_user(email) {
    const client = await pool.connect()

    const { rows } = await client.query({
        text: 'select * from users where email=$1',
        values: [email]
    })
    client.release()

    return rows[0]
}

async function create_question(user_id, question, respCorrecta, respIncorrecta01, respIncorrecta02) {
    const client = await pool.connect();

    await client.query({
        text: "insert into questions (user_id, question, respCorrecta, respIncorrecta01, respIncorrecta02) values ($1, $2, $3,$4,$5)",
        values: [user_id, question, respCorrecta, respIncorrecta01, respIncorrecta02],
    });

    client.release();
}

async function get_questions() {
    const client = await pool.connect();

    const { rows } = await client.query({
        text: "select * from questions order by random() limit 3",
    });
    client.release();

    return rows;
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}


async function respuesta(pregunta, id) {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: "select respCorrecta=$1 as respuesta from questions where id=$2",
        values: [pregunta, id],
    });
    console.log("esto devuelve row", rows[0]);
    client.release();

    return rows[0].respuesta;
}

async function score(nombre, puntaje, porcentaje) {
    const client = await pool.connect();

    const { rows } = await client.query({
        text: "insert into score (name, puntaje, porcentaje) values ($1, $2, $3)",
        values: [nombre, puntaje, porcentaje],
    });
    console.log("esto es prueba", rows);
    client.release();
}


async function get_score() {
    const client = await pool.connect();

    const { rows } = await client.query({
        text: "select * from score order by puntaje DESC",
    });
    client.release();

    return rows;
}

module.exports = {
    get_user,
    create_user,
    create_question,
    get_questions,
    shuffle,
    respuesta,
    score,
    get_score,
};