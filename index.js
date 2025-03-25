const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

// const SECRET_KEY = "supersecretadmin";

const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const JWT_SECRET = 'your_jwt_token';

const {initializeDatabase} = require('./db/db.connect');

const TaskTrek = require('./models/user.models');

app.use(express.json());


const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token){
        return res.status(401).json({message: "No token provided."})
    }

    try {
        // console.log(token)

        const decodedToken = jwt.verify(token, JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(402).json({message: "Invalid token"});
    }
}

initializeDatabase();



// authorize user

app.post('/login', async (req, res) => {
    try {
    const {username, password} = req.body;

    const user = await TaskTrek.findOne({username});

    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    if(user.password !== password){
        return res.status(401).json({message: "Invalid Password"})
    }

    const token = jwt.sign({role: 'admin'}, JWT_SECRET, {expiresIn: '24h'});

    res.json({token, message: "Login success"})
    
    } catch (error) {
        res.status(500).json({message: 'Server Error', error})
    }
})


app.get('/api/data', verifyJWT, (req, res) => {
    res.json({message: "Protected route accesible."})
})


// Add a new user:


app.post('/user', async (req, res) => {
    try {
        const {username, password} = req.body;
        
        if (!username || !password) {
            return res.status(400).json({message: 'Username and password are required.'});
        }

        // Check if the user already exists
        const existingUser = await TaskTrek.findOne({username});

        if (existingUser) {
            return res.status(400).json({message: 'Username already taken.'});
        }

        // Create new user
        const newUser = new TaskTrek({username, password});
        const savedUser = await newUser.save();

        // Send success response
        res.status(201).json({message: 'User added successfully', user: savedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to add user'});
    }
});



// Fetch user by username


async function readByUsername(username) {
    try {
        const getUser = await TaskTrek.findOne({username: username});

        return getUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}


app.get('/getuser/:username', async(req, res) => {
    try {
        const getUser = await readByUsername(req.params.username);

        if(getUser){
            res.json(getUser)
        }else{
            res.status(404).json({error: 'Hotel not found'})
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to find hotels.'})
    }
})



const PORT = 3000;


app.listen(PORT,  () => {
    console.log(`Server is running on ${PORT}`)
})