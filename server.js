const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')


const app = express()

// CONFIGURACIONES
app.use(express.static('static'))

nunjucks.configure("templates", {
    express: app,
    autoscape: true,
    watch: true,
});

// configuramos la subida de archivos
app.use(fileUpload({
    limits: { fileSize: 5242880 },
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo supera el máximo (5Mb)'
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(session({
    secret: 'mi-clave',
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

app.use(flash())

// para dejar el user como variable global de los templates
app.use(function(req, res, next) {
    res.locals.user = req.session.user
    next()
})

// RUTAS
app.use(require('./routes/auth.js'))
app.use(require('./routes/routes.js'))

const PORT = 3000
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`))