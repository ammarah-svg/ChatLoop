const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const connect = require("./config/connectDB");
const bcrypt = require('bcryptjs');
const Message = require('./models/Message')
const ws = require('ws');
const fs = require('fs');
require("dotenv").config();
const app = express();
const cors = require("cors");

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your React app's URL
  credentials: true, // Enable set cookie
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
// Connect to the database
connect();

const jwtSecret = process.env.JWT_SECRET;

// Test route
app.get("/test", (req, res) => {
  res.json("test ok");
});




async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject('no token');
    }
  });

}


app.get('/messages/:userId', async (req,res) => {
  const {userId} = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender:{$in:[userId,ourUserId]},
    recipient:{$in:[userId,ourUserId]},
  }).sort({createdAt: 1});
  res.json(messages);
});

app.get('/people', async (req,res) => {
  const users = await User.find({}, {'_id':1,username:1});
  res.json(users);
});





app.get('/profile', (req,res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/login', async (req,res) => {
  const {email, password} = req.body;
  const foundUser = await User.findOne({email});
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({userId:foundUser._id,email}, jwtSecret, {}, (err, token) => {
        res.cookie('token', token, {sameSite:'none', secure:true}).json({
          id: foundUser._id,
        });
      });
    }
  }
});

// Modified logout function
app.post('/logout', (req,res) => {
  res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
});


// Register route
app.post("/register", async (req, res) => {
  const { username,email, password } = req.body;
 // Validate the input
 if (!username || !email || !password) {
  return res.status(400).json({ error: "Username and password are required" });
}

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

   
    // Create the user in the database
    const createdUser = await User.create({ username, email,password:hashedPassword });

    // Sign the JWT token with the userId
    jwt.sign({ userId: createdUser._id ,username,email}, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error("Error signing token:", err);
        return res.status(500).json({ error: "Error signing token" });
      }

      // Set the cookie with the token
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Secure flag for production
          sameSite: "strict", // CSRF protection
        })
        .status(201)
        .json({ id: createdUser._id, message: "User registered successfully", username });
    });
  } catch (error) {
    console.error("Error during registration:", error);

    // Handle duplicate username error
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Fallback for other errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start the server
const server = app.listen(4040, () => {
  console.log("Server is running on http://localhost:4040");
});

const wss = new ws.WebSocketServer({server});
wss.on('connection', (connection, req) => {

  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }));
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const {userId, username} = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
   
   try {
    const messageData = JSON.parse(message.toString());
    const {recipient, text, file} = messageData;
    let filename = null;
    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.'+ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:'+path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender:connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      console.log('created message');
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.userId,
          recipient,
          file: file ? filename : null,
          _id:messageDoc._id,
        })));
    }
   } catch (error) {
    console.error('Error processing message:', error);
   }
   
   
   
   
    
  });

  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
});