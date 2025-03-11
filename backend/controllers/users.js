const bcrypt = require('bcrypt');
const db = require('../database')

const userRegister = async(req,res)=>{
    const data = req.body
    try{
        // Checking if user already exists
        const [result1] = await db.promise().query(`select user_id from users where email_id='${data.email_id}';`)
        if(result1.length==0){
            // Inserting into users table
            const query1 = `insert into users (user_name,phone_no,email_id) values(?,?,?);`
            await db.promise().query(query1,[data.user_name,data.phone_no,data.email_id])

            // Retrieving user_id
            const query2 = `select user_id from users where email_id=?`
            const [result2] = await db.promise().query(query2,[data.email_id])
            const user_id = result2[0].user_id

            // Hashing password before inserting into user_credentials table
            bcrypt.hash(data.password,10,async(err,hashedPassword)=>{
                if(err){
                    console.error('Error hashing password:', err);
                    return res.status(500).send('Internal server error');
                }
                // Inserting into user_credentials table
                const query3 = `insert into user_credentials values(?,?);`
                await db.promise().query(query3,[user_id,hashedPassword]);
                res.json({status:"Successfully registered"})
            })
        }
        else{
            res.json({status:"User already exist"})
        }
    }catch(error){
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'Database error' });
    }
}

const userLogin = async(req,res)=>{
    const data = req.body
    try{
        // Fetch user_id from users table if user exist
        const query1 =  `select user_id from users where email_id=?`
        const [result1] = await db.promise().query(query1,[data.email_id])
        
        // Check if user exists

        
        if(result1.length==0){
            res.json({"status":"User does not exist"})
            return
        }
        else{
            // Check if password is correct
            user_id = result1[0].user_id
            const query2 = `select password from user_credentials where user_id=?`
            const [result2] = await db.promise().query(query2,[user_id])
            const hashedPassword = result2[0].password
            bcrypt.compare(data.password,hashedPassword,(err,result)=>{
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Internal server error');
                  }
                if (result) {
                    // Passwords match. User authenticated.
                    res.json({"status":"Authenticated","user_id":user_id})
                  } else {
                    // Passwords do not match. Authentication failed.
                    res.json({"status":"Invalid username or password"})
                  }
            })
            
        }
    }catch(error){
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'Database error' });
    }

}

module.exports = {
    userRegister,
    userLogin
}