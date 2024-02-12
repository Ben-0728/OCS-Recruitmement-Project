const express = require("express");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.use(express.static("/"));
app.use(cors());

const connectionString = "postgresql://bens.21354:dqyEb0CW7mPB@ep-lively-snow-a5o12dev.us-east-2.aws.neon.tech/WebD-Harkirat?sslmode=require"

const db = new Client({
    connectionString: connectionString
});

db.connect().then(function(){console.log("Connected to PostgreSQL")}).catch(function(err){console.log("PostgreSQL Connection Error:" + err)});

app.use(bodyParser.json());

app.get("/", function(req, res){
    res.sendFile("./frontend.html");
})

app.post("/signin",async function(req,res){

    const { username, password } = req.body;

  const query = `SELECT userid, password_hash, role FROM users WHERE userid = $1 AND password_hash = $2`;

    try {
      const user=await db.query(query,[username,password]);
      if(!user.rowCount){
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
      else{
        if(user.rows[0].role == "admin"){
          try{
            const allUsersQuery = 'SELECT userid, password_hash, role FROM users';
            const allUsers=await db.query(allUsersQuery);
            return res.json(allUsers.rows);
          }
          catch(err){
            return res.status(500).json({error: "Internal Server Error"} )
          }
        }
        else{
          return res.json(user.rows);
        }
      }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
 })


app.listen(3000);
