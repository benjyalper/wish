import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use('/public/images', express.static('images'));


app.get('/', (req, res) => {
    const wish = req.body;
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
});

