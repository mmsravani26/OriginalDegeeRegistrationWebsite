
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();


app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:3001");
    next();
});
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies and headers to be passed
}));

const con = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "iiits123",
    database: "signup"
})

app.post('/register', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    con.query("INSERT INTO user (email,username, password) VALUES (?, ?, ?)", [email, username, password], 
        (err, result) => {
            if(result){
                res.send(result);
            }else{
                res.send({message: "ENTER CORRECT ASKED DETAILS!"})
            }
        }
    )
})
app.post('/handleSubmit', (req, res) => {
    console.log("Received data:", req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const collegeid = req.body.collegeid;
    const mailId = req.body.mailId;
    const dateofarrival = req.body.dateofarrival;

    con.query("INSERT INTO RegisterData (firstName, lastName, collegeid, mailId, date) VALUES (?, ?, ?, ?, ? )", [firstName, lastName, collegeid, mailId, dateofarrival],
    (err, result) => {
        if (err) {
            console.error("Database error:", err);
            res.send({ message: "Database Error" });
        } else {
            console.log("Insert successful. Result:", result);
            res.send(result);
        }
    }
);

})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    con.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], 
        (err, result) => {
            if(err){
                req.setEncoding({err: err});
            }else{
                if(result.length > 0){
                    res.send(result);
                }else{
                    res.send({message: "WRONG USERNAME OR PASSWORD!"})
                }
            }
        }
    )
})

app.listen(3001, () => {
    console.log("running backend server");
})