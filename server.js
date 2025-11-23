const express = require ('express')
const { Pool } = require ("pg")
const app = express ()
const port = 3000

app.use(express.json());
const pool = new Pool ({
    host : "localhost",
    port : 5432,
    user : "postgres",
    password : "admin",
    database : "artisans_db"
});




const main = async ()=>{
const createTable = async ()=>{

  
  const query = `CREATE TABLE  IF NOT EXISTS artisans(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    address varchar(255),
    profession varchar(255),
    age int,
    phoneNumber varchar(20),
    email varchar(255) NOT NULL UNIQUE,
    city varchar(255),
    rating DECIMAL(3,2),
    description varchar(255),
    CHECK (email LIKE '%@%.%')

  )`;

  await pool.query(query)
}

  app.post('/artisans', async (req, res) => {
    try {
      const { name, address, profession, age, phonenumber, email, city, rating, description }= req.body;

      const query =`
        INSERT INTO artisans (name, address, profession, age, phonenumber, email, city, rating, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        await pool.query(query, [name, address, profession, age, phonenumber, email, city, rating, description]);
        res.status(201).json({ 
            message: 'Artisan created successfully'
        });
      } catch (error) {
        console.error('Error creating artisan:', error);
        res.status(500).json({ 
            error: 'Failed to create artisan'
        });

    }
  });

  app.get ("/artisans" , async (req, res) => {
    try{
      const query = "SELECT * FROM artisans";
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error ("Error fetching artisans :", error);
      res.status(500).json({
        error: "Failed to fetch artisans",
      })

    }
  });
  app.get ("/artisans/:id" , async (req, res) => {
    try{
      const id = req.params.id;
      const query = "SELECT * FROM artisans WHERE id = $1";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0){
        return res.status(404).json({
          error: "Artisan Not Found",
        })
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error ("Error fetching artisan :", error);
      res.status(500).json({
        error: "Failed to fetch artisan",
      })
    }

  });
  app.put ("/artisans/:id" , async (req, res) => {
    try{
      const id = req.params.id;
      const { name, address, profession, age, phonenumber, email, city, rating, description }= req.body;
      const query = "UPDATE artisans SET name = $1, address = $2, profession = $3, age = $4, phonenumber = $5, email = $6, city = $7, rating = $8, description = $9  WHERE id = $10";
      const result = await pool.query(query,[name, address, profession, age, phonenumber, email, city, rating, description,id]);

      if (result.rowCount > 0){
        res.status(200).json({message: 'Artisan updated successfully'} );
      }else{
        res.status(404).send({error: 'Artisan not found'});
      }
    } catch (error) {
      console.error ("Error updating artisan :", error);
      res.status(500).json({
        error: "Failed to update artisan",
      })
    }

  });
  app.delete ('/artisans/:id', async (req, res) => {
    try{
      const id = req.params.id;
      const query = `DELETE FROM artisans WHERE id = $1`;
      const result = await pool.query(query, [id]);

    if (result.rowCount > 0) {
    res.status(200).json({ message: 'Artisan deleted successfully'} );
    } else {
    res.status(404).json({ error: 'Artisan not found' });
    }
    } catch(error) {
      console.error('Error deleting artisan:', error);
      res.status(500).json({ 
        error: 'Failed to delete artisan',
  });
}
});
  app.listen(port, () =>{
      console.log(`Server running on port ${port}`);
  });
}
main();





