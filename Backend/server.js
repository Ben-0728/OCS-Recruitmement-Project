const express = require("express");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const cors=require("cors");

const app = express();

app.use(express.static("/home/ben/Desktop/WebD/OCS Recruitmement/Frontend/"));
app.use(cors());

const connectionString = "postgresql://bens.21354:dqyEb0CW7mPB@ep-lively-snow-a5o12dev.us-east-2.aws.neon.tech/WebD-Harkirat?sslmode=require"

const db = new Client({
    connectionString: connectionString
});

db.connect().then(function(){console.log("Connected to PostgreSQL")}).catch(function(err){console.log("PostgreSQL Connection Error:" + err)});

app.use(bodyParser.json());

app.get("/", function(req, res){
    res.sendFile("/home/ben/Desktop/WebD/OCS Recruitmement/Frontend/index.html");
})

app.post("/signin",async function(req,res){

    const { username, password } = req.body;
    // const hashedPassword = md5(password);

  const query = `SELECT userid, password_hash, role FROM users WHERE userid = $1 AND password_hash = $2`;
//   db.query(query,[username, hashedPassword], function(err, results){
//     if (err) {
//       console.error('PostgreSQL query error1:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (results.length) {
//       const user = results.rows[0];

//       if (user.role === 'admin') {
//         console.log("User is an admin");
//         const allUsersQuery = 'SELECT userid, password_hash, role FROM users';
//         db.query(allUsersQuery, (err, allUsers) => {
//           if (err) {
//             console.error('PostgreSQL query error:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }
//           res.json(allUsers.rows);
//         });
//       } else {
//         console.log("User is not admin");
//         res.json([{ userid: user.userid,password_hash: user.password_hash, role: user.role }]);
//       }
//     } else {
//         console.log("Invalid credentials");
//       res.status(401).json({ error: 'Invalid username or password.' });
//     }
//   });

    
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