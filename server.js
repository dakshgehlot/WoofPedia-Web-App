const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rick@astley', // replace with your password
  database: 'dog_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

// Set up route handler for GET /dogDetails endpoint
app.get('/breed/details/:breedName', async (req, res) => {
  try {
    const breedName = req.params.breedName;
    const breedDetailsUrl = `https://api.thedogapi.com/v1/breeds/search?q=${breedName}`;
    const breedDetailsResponse = await axios.get(breedDetailsUrl);
    const breedDetails = breedDetailsResponse.data[0];
    
    let breedImageUrl;
    if (breedDetails.reference_image_id) {
      const breedImageId = breedDetails.reference_image_id;
      const breedImageUrlResponse = await axios.get(`https://api.thedogapi.com/v1/images/${breedImageId}`);
      breedImageUrl = breedImageUrlResponse.data.url;
    }
    
            // Save dog details to database
            const sql = 'INSERT INTO dog_history (breed, height, weight, lifespan, temperament) VALUES (?, ?, ?, ?, ?)';
            const values = [breedDetails.name, breedDetails.height.metric, breedDetails.weight.metric, breedDetails.life_span, breedDetails.temperament];
            connection.query(sql, values, function(error, result) {
              
              if (error) {
                console.error('Error saving breed details to MySQL:', error);
              } else {
                console.log('Breed details saved to MySQL:', result);
              }
            });

    res.send({
      breedName: breedDetails.name,
      height: `${breedDetails.height.metric} cm`,
      weight: `${breedDetails.weight.metric} kg`,
      lifespan: breedDetails.life_span,
      temperament: breedDetails.temperament,
      imageUrl: breedImageUrl || 'image-not-found-dog.jpg'
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/breed/history", (req, res) => {
  const query = "SELECT * FROM dog_history ORDER BY search_date DESC LIMIT 10";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching dog breed history from database:", error);
      return res.status(500).send("Error fetching dog breed history from database");
    }

    console.log("Dog breed history fetched from database");
    res.status(200).json(results);
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
