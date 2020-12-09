const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 3000;
let fav = [];

app.get('/', (req, res) => {
    res.send("<h1>Welcome<h1/><a href='/favoris'>Check out favs</a>");
})

app.get('/favoris', (req, res) => {
    res.send(fav);
})

app.post('/favoris/', (req, res) => {
    if (fav.includes(req.body.photoId)) {
        fav = fav.filter(item => item !== req.body.photoId)
    } else {
        fav.push(req.body.photoId)
    }
    res.send(fav);
})

app.post('/favoris/', (req, res) => {
    console.log(req.body.favs)
    req.body.favs.forEach(fav => {
        if (fav.includes(req.body.photoId)) {
            fav = fav.filter(item => item !== req.body.photoId)
        } else {
            fav.push(req.body.photoId)
        }
    })
    res.send(fav);
})

app.listen(port)
