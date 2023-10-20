import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from 'mysql2';


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'benjyalper',
    password: 'Ag1ag1ag1$',
    database: 'wishdatabase',
    charset: 'UTF8MB4_GENERAL_CI', // Set the character set to UTF-8
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use('/public/images', express.static('images'));

app.get('/favicon.ico', (req, res) => res.status(204));

// dbpath: C:\Program Files\MongoDB\Server\7.0\data\
app.get('/', (req, res) => {
    const wish = req.body;
    res.sendFile(__dirname + '/public/index.html');
});

// Modify the '/wishes' route to get random wishes from the database
app.get('/wishes', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Error connecting to the database.' });
        }

        // Query to select a random wish from the database
        const selectRandomWishQuery = 'SELECT * FROM wishes ORDER BY RAND() LIMIT 1';
        const showAllQueries = 'SELECT * FROM wishes';
        connection.query(showAllQueries, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error retrieving wishes from the database:', error);
                return res.status(500).json({ error: 'Error retrieving wishes from the database' });
            }

            // Send the retrieved random wish as a response
            return res.status(200).json({ wish: results });
        });
    });
});


app.post('/submit', (req, res) => {
    const submittedText = req.body.text;

    if (submittedText.length > 100) {
        return res.status(400).json({ error: 'Text exceeds the maximum character limit of 100.' });
    }


    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Error connecting to the database.' });
        }

        // Use parameterized query to prevent SQL injection
        const insertQuery = 'INSERT INTO wishes (text) VALUES (?)';
        connection.query(insertQuery, [submittedText], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error inserting data into the database:', error);
                return res.status(500).json({ error: 'Error inserting data into the database' });
            }
            console.log('Data inserted successfully:', results);
            return res.status(200).json({ message: 'Data inserted successfully!', data: results });
        });
    });
});



app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
});



