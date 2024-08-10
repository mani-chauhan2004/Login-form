import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

dotenv.config();

const port = process.env.PORT;
const mongoURL = process.env.MONGO_URL;

const app = express();
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(mongoURL, 
    {
        useNewURLParser: true,
        useUnifiedTopology: true,
    }
)
.then(() => {
    console.log("Connection with the database established successfully!");
    
})
.catch((err) => {
    console.log(err);
});

const userSchema = new mongoose.Schema({
    fName: String, 
    lName: String,
    email: String,
    password: String,
});

const User = mongoose.model('Users', userSchema, 'Users');


app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/submit", async (req, res) => {
    const user = new User({
        fName: req.body.fname, 
        lName: req.body.lname,
        email: req.body.email,
        password: req.body.password,
    });
    try{
        const newSavedUser = await user.save();
        res.redirect("/");
    }
    catch(err) {
        res.status(400).send(err);
    }
})

app.listen(port, () => {
    console.log(`The server is running on the port ${port}`);
});
