const bcrypt = require('bcrypt');
const db = require('../database')

const adminLogin = async(req,res)=>{
    const data = req.body
    try{
        // Fetch user_id from users table if user exist
        const query1 =  ` select admin_id from admin where admin_email_id = ?`
        const [result1] = await db.promise().query(query1,[data.email_id])
        
        if(result1.length==0){
            res.json({"status":"Incorrect email id"})
            return
        }
        else{
            // Check if password is correct
            admin_id = result1[0].admin_id
            const query2 = `select admin_password from admin_credentials where admin_id=?`
            const [result2] = await db.promise().query(query2,[admin_id])
            const hashedPassword = result2[0].admin_password
            bcrypt.compare(data.password,hashedPassword,(err,result)=>{
                console.log(data.password,"hi")
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Internal server error');
                  }
                if (result) {
                    // Passwords match. User authenticated.
                    res.json({"status":"Authenticated","admin_id":admin_id})
                  } else {
                    // Passwords do not match. Authentication failed.
                    res.json({"status":"Incorrect password"})
                  }
            })
            
        }
    }catch(error){
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'Database error' });
    }
}

const fetchUsers = async(req,res)=>{
    const query = `select *,user_id as id from users`
    try{
        const [result] = await db.promise().query(query)
        res.json(result)
        return
    }catch(error){
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'Database error' });
    }
}



module.exports = {
    adminLogin,
    fetchUsers
}