const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

const SECRET_KEY = "supersecretadmin";

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
        
    } catch (error) {
        
    }
}

initializeDatabase();



// authorize user

app.post('/login', (req, res) => {
    const {secret} = req.body;

    if(secret === SECRET_KEY){
        const token = jwt.sign({role: "admin"}, JWT_SECRET, {expiresIn: '24h'});
        res.json({token})
    }else{
        res.json({message: "Invalid Secret"})
    }
})


// Add a new user:

const addUser = async (userData) => {
    try {
        const newUser = new TaskTrek(userData);
        await newUser.save();
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.post('/user', async(req, res) => {
    try {
        const savedUser = await addUser(req.body);
        req.status(200).json({message: "User added", user: savedUser});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Failed to add user'})
    }
})




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