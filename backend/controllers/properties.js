const db = require('../database')

const addProperty = async (req, res) => {
    try {
        const data = req.body;

        //Inserting into properties
        const query1 = `INSERT INTO properties (owner_id, price, description, area, posted_on, status) VALUES (?, ?, ?, ?, ?, 'available')`;
        await db.promise().query(query1, [data.user_id, data.price, data.description, data.area, data.posted_on]);

        //Getting last inserted property_id
        const [result1] =  await db.promise().query('select property_id from properties order by property_id desc limit 1');
                //property_id is stored in result1[0].property_id

        //inserting into location table
        const query3 = `insert into location(property_id,city,district,town,latitude,longitude) values(?,?,?,?,?,?);`
        await db.promise().query(query3,[result1[0].property_id,data.city,data.district,data.town,data.latitude,data.longitude])

        // Uploading image urls into images table
        const image_urls = data.image_urls
        switch(data.no_of_images){
            case 1:
                const query4 = `insert into images (property_id,image_url) values (?,?);`
                await db.promise().query(query4,[result1[0].property_id,image_urls[0]])
                break
            case 2:
                const query5 = `insert into images (property_id,image_url) values 
                                (${result1[0].property_id},'${image_urls[0]}'),
                                (${result1[0].property_id},'${image_urls[1]}');`
                await db.promise().query(query5)
                break
            case 3:
                const query6 = `insert into images (property_id,image_url) values 
                                (${result1[0].property_id},'${image_urls[0]}'),
                                (${result1[0].property_id},'${image_urls[1]}'),
                                (${result1[0].property_id},'${image_urls[2]}');`
                await db.promise().query(query6)
                break
            case 4:
                const query7 = `INSERT INTO images (property_id, image_url) VALUES 
                                (${result1[0].property_id}, '${image_urls[0]}'),
                                (${result1[0].property_id}, '${image_urls[1]}'),
                                (${result1[0].property_id}, '${image_urls[2]}'),
                                (${result1[0].property_id}, '${image_urls[3]}');`;
                await db.promise().query(query7);
                break
        }
        res.status(200).json({ success: true });
        return
    } catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).json({ error: 'Database error' });
    }
}

const searchProperty = async(req,res)=>{
    const city = req.query.city
    const district = req.query.district
    const town = req.query.town

    const query = `SELECT 
    images.property_id,
    images.image_urls_array,
    second_query.property_id AS property_id,
    second_query.user_id,
    second_query.formatted_posted_on,
    second_query.area,
    second_query.city,
    second_query.description,
    second_query.district,
    second_query.email_id,
    second_query.latitude,
    second_query.longitude,
    second_query.phone_no,
    second_query.price,
    second_query.town,
    second_query.user_name
FROM
    (SELECT 
        property_id,
        JSON_ARRAYAGG(image_url) AS image_urls_array
    FROM 
        images
    GROUP BY 
        property_id) AS images
JOIN
    (SELECT 
        properties.property_id,
        users.user_id,
        DATE_FORMAT(properties.posted_on, '%d - %m - %Y') AS formatted_posted_on,
        area,
        city,
        description,
        district,
        email_id,
        latitude,
        longitude,
        phone_no,
        price,
        town,
        user_name
    FROM 
        users, 
        properties, 
        location
    WHERE 
        city='${city}'
        AND district='${district}'
        AND town='${town}'
        AND location.property_id=properties.property_id
        AND properties.owner_id=users.user_id
        AND status='available') AS second_query
ON
    images.property_id = second_query.property_id;

`
    const [result] = await db.promise().query(query)
    
    res.send(result)
}

const filterAndSort = async(req,res)=>{
    const data = req.body
    if(data.maximum_area==''){
        data.maximum_area='2147483647'
    }
    if(data.maximum_price==''){
        data.maximum_price='2147483647'
    }
    if(data.minimum_price==''){
        data.minimum_price='0'
    }
    if(data.minimum_area==''){
        data.minimum_area='0'
    }
    // Sorting 
    const query = `SELECT 
    images.property_id,
    images.image_urls_array,
    second_query.property_id AS property_id,
    second_query.user_id,
    second_query.formatted_posted_on,
    second_query.area,
    second_query.city,
    second_query.description,
    second_query.district,
    second_query.email_id,
    second_query.latitude,
    second_query.longitude,
    second_query.phone_no,
    second_query.price,
    second_query.town,
    second_query.user_name
FROM
    (SELECT 
        property_id,
        JSON_ARRAYAGG(image_url) AS image_urls_array
    FROM 
        images
    GROUP BY 
        property_id) AS images
JOIN
    (SELECT 
        properties.property_id,
        users.user_id,
        DATE_FORMAT(properties.posted_on, '%d - %m - %Y') AS formatted_posted_on,
        area,
        city,
        description,
        district,
        email_id,
        latitude,
        longitude,
        phone_no,
        price,
        town,
        user_name
    FROM 
        users, 
        properties, 
        location
    WHERE 
        city='${data.city}'
        AND district='${data.district}'
        AND town='${data.town}'
        AND location.property_id=properties.property_id
        AND properties.owner_id=users.user_id
        AND properties.price>=${data.minimum_price} and properties.price<=${data.maximum_price} and properties.area<=${data.maximum_area} and properties.area>=${data.minimum_area}
        AND status='available') AS second_query 
    ON
    images.property_id = second_query.property_id 
    ORDER BY
    ${data.sort_by};;

`
    const [result] = await db.promise().query(query)
    res.json(result)
    
}

const savedTableInsert = async(req,res)=>{
    const data = req.body
    // Checking if already in saved table
    const query1 = `select saved_id from saved where property_id=? and user_id=?;`
    
    const [result1] = await db.promise().query(query1,[data.property_id,data.user_id])
    if (result1.length==0){
        const query2 = `insert into saved (user_id,property_id) values(?,?)`
        await db.promise().query(query2,[data.user_id,data.property_id])
        res.json({status:"Saved to later"})
    }
    else{
        res.json({status:"Already saved"})
    }
}

const savedTableretrieve = async(req,res)=>{
    const user_id = req.query.user_id
    const query = `SELECT 
    images.property_id,
    images.image_urls_array,
    second_query.property_id AS property_id,
    second_query.user_id,
    second_query.formatted_posted_on,
    second_query.area,
    second_query.city,
    second_query.description,
    second_query.district,
    second_query.email_id,
    second_query.latitude,
    second_query.longitude,
    second_query.phone_no,
    second_query.price,
    second_query.town,
    second_query.user_name
FROM
    (SELECT 
        property_id,
        JSON_ARRAYAGG(image_url) AS image_urls_array
    FROM 
        images
    GROUP BY 
        property_id) AS images
JOIN
    (SELECT 
        properties.property_id,
        users.user_id,
        DATE_FORMAT(properties.posted_on, '%d - %m - %Y') AS formatted_posted_on,
        area,
        city,
        description,
        district,
        email_id,
        latitude,
        longitude,
        phone_no,
        price,
        town,
        user_name
    FROM 
        users, 
        properties, 
        location,
        saved

    WHERE 
        saved.user_id =${user_id} and saved.user_id=users.user_id and properties.property_id=saved.property_id and location.property_id=properties.property_id
        AND status='available') AS second_query
ON
    images.property_id = second_query.property_id;

`
    const [result] = await db.promise().query(query)
    res.json(result)
}

const retrieveProperties = async(req,res)=>{
    const user_id = req.query.user_id
    const query = `SELECT 
    images.property_id,
    images.image_urls_array,
    second_query.property_id AS property_id,
    second_query.user_id,
    second_query.formatted_posted_on,
    second_query.area,
    second_query.city,
    second_query.description,
    second_query.district,
    second_query.email_id,
    second_query.latitude,
    second_query.longitude,
    second_query.phone_no,
    second_query.price,
    second_query.town,
    second_query.user_name
FROM
    (SELECT 
        property_id,
        JSON_ARRAYAGG(image_url) AS image_urls_array
    FROM 
        images
    GROUP BY 
        property_id) AS images
JOIN
    (SELECT 
        properties.property_id,
        users.user_id,
        DATE_FORMAT(properties.posted_on, '%d - %m - %Y') AS formatted_posted_on,
        area,
        city,
        description,
        district,
        email_id,
        latitude,
        longitude,
        phone_no,
        price,
        town,
        user_name
    FROM 
        users, 
        properties, 
        location
    WHERE 
        users.user_id = ${user_id}
        AND location.property_id=properties.property_id
        AND properties.owner_id=users.user_id
        AND status='available') AS second_query
ON
    images.property_id = second_query.property_id;

`
    const [result] = await db.promise().query(query)
    res.json(result)
}

const deleteProperty = async(req,res)=>{
    const data = req.body
    const query = `update properties set status ='sold' where property_id=${data.property_id}`
    await db.promise().query(query)
    res.send("success")
}

const deleteSaved = async(req,res)=>{
    const data = req.body
    const query = `delete from saved where property_id=${data.property_id}`
    await db.promise().query(query)
    res.send("success")
}

module.exports = {
    addProperty,
    searchProperty,
    filterAndSort,
    savedTableInsert,
    savedTableretrieve,
    retrieveProperties,
    deleteProperty,
    deleteSaved
}