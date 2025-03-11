const express = require('express')
const app = express()
const port = 3001
const db = require('./database')
var cors = require("cors")
const bodyParser = require('body-parser')

app.use(cors())

db.connect(async function(err){
    if (err) throw err;
    console.log("Connected!")

    // Tables created = users,user_credentials,properties,location

    try{
        const users_query = "create table if not exists users(user_id int primary key auto_increment,user_name varchar(50),phone_no varchar(10),email_id varchar(50));"
        await db.promise().query(users_query)
        console.log("users table created successfully")

        const userCredentials_query = "create table if not exists user_credentials(user_id int primary key,password varchar(250), foreign key (user_id) references users(user_id) on delete cascade);"
        await db.promise().query(userCredentials_query)
        console.log("user_credentials table created successfully")

        const properties_query = "create table if not exists properties(property_id int primary key auto_increment,owner_id int,price int,description varchar(1000),area int,posted_on date,status enum('available','sold'), foreign key (owner_id) references users(user_id) on delete cascade);"
        await db.promise().query(properties_query)
        console.log("properties table created successfully")

        const location_query = "create table if not exists location(location_id int primary key auto_increment,property_id int,latitude float,longitude float,city varchar(50),district varchar(50),town varchar(50), foreign key (property_id) references properties(property_id) on delete cascade);"
        await db.promise().query(location_query)
        console.log("location table created successfully")

        const saved_query = "create table if not exists saved(saved_id int primary key auto_increment,user_id int,property_id int,foreign key (user_id) references users(user_id),foreign key (property_id) references properties(property_id));"
        await db.promise().query(saved_query)
        console.log("saved table created successfully")

        const images_query = "create table if not exists images(image_id int primary key auto_increment,property_id int,image_url varchar(250),foreign key (property_id) references properties(property_id) );"
        await db.promise().query(images_query)
        console.log("images table created successfully")

        const admin_query = "create table if not exists admin(admin_id int primary key auto_increment,admin_name varchar(50),admin_phone_no varchar(10),admin_email_id varchar(50));"
        await db.promise().query(admin_query)
        console.log("admin table created successfully")

        const adminCredentials = "create table if not exists admin_credentials(admin_id int primary key,admin_password varchar(250), foreign key (admin_id) references admin(admin_id) on delete cascade);"
        await db.promise().query(adminCredentials)
        console.log("admin_credentials table created successfully")

    }catch(error){
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'Database error' });
    }
 
})

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const  userRoute = require('./routes/index')
app.use('/',userRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})