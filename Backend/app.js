  // Importing required modules
  const express = require('express');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const mysql = require('mysql2'); // MySQL library
  const axios = require('axios'); // Axios for HTTP requests
  require('dotenv').config(); // To load environment variables
 

  const app = express();
  const PORT = 3001; // Your backend server port

  // Create a MySQL connection
  const db = mysql.createConnection({
    host: 'localhost',   // MySQL host (update if needed)
    user: 'root',        // MySQL username (update if needed)
    password: '',        // MySQL password (update if needed)
    database: 'testdb'   // Your MySQL database name
  })

  // Connect to the MySQL database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the database.');
  });

  // CORS configuration to allow frontend requests
  app.use(cors());

  app.use(bodyParser.json()); // To parse JSON in request bodies
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json()); // This must be declared before your routes
  // Register Route
  app.post('/register', async (req, res) => {
    const { email, password, captcha } = req.body;
    console.log('Received data:', req.body); // Log the received data

    // Check if captcha exists
    // if (!captcha) {
    //   return res.status(400).json({ message: 'Captcha verification failed' });
    // }

    try {
      // Verify CAPTCHA with Google's reCAPTCHA API
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY, // Use environment variable for secret key
            response: captcha,
          },
        }
      );

      // // If CAPTCHA verification fails
      // if (!response.data.success) {
      //   return res.status(400).json({ message: 'Captcha verification failed' });
      // }

      // Check if the user already exists
      db.query('SELECT * FROM employee WHERE Email = ?', [email], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Server error');
        }

        if (results.length > 0) {
          console.log(results.length, 'results');
          
          return res.status(409).send('User already exists');
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        db.query('INSERT INTO employee (Email, Password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Error during registration');
          }
          res.status(201).send('User Registered');
        });
      });
    } catch (error) {
      // console.error('Error during CAPTCHA verification:', error);
      // res.status(500).json({ message: 'Server error during CAPTCHA verification' });
    }
  });
  app.post('/login', async (req, res) => {
      const { email, password } = req.body;
    
      // Check if the email and password are provided
      if (!email || !password) {
        return res.status(400).send('Please provide both email and password');
      }
    
      // Query to find the user by email
      db.query('SELECT * FROM employee WHERE Email = ?', [email], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Server error');
        }
    
        if (results.length === 0) {
          return res.status(400).send('User not found');
        }
    
        const user = results[0];
    
        // Compare the entered password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.Password);
    
        if (!isMatch) {
          return res.status(400).send('Invalid credentials');
        }
    
        // Create JWT token if login is successful
        const token = jwt.sign({ email: user.Email }, process.env.SESSION_SECRET, { expiresIn: '1h' });
    
        // Send the token and email back in the response
        res.json({ token, email: user.Email });
      });
    });
    //get Products
    app.get('/product',(req,res)=>{
      db.query('SELECT * FROM products',(err,results)=>{
        if(err){
          console.error('Database error:', err);
          return res.status(500).send('Server error');
        }
        res.json(results)
      })

    })
    //add Product
    app.post('/addProduct',(req,res)=>{
      const {name, description, price, image_url} = req.body
      if(!name || !price){
        return res.status(400).send('Please provide all required fields')
      }
      db.query('INSERT INTO products  (name, description, price, image_url) VALUES (?,?,?,?)',[name, description, price, image_url],(err,result)=>{
        if(err){
          console.error('Database error:', err);
          return res.status(500).send('Server error');
        }
        res.status(201).send('Product added successfully')
      }
    )})
    app.get('/editproduct/:id', (req, res) => {
      const { id } = req.params;
    
      db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Server error');
        }
    
        if (results.length === 0) {
          return res.status(404).send('Product not found');
        }
    
        res.json(results[0]); // Return the found product
      });
    });
    
    //Delete the product
    app.delete('/productdel/:id',async(req,res)=>{
      const {id}=req.params
      try{
        const result= db.query('DELETE FROM products WHERE id=?',[id])
        console.log(result,'result');
        
        if(result.affectedRows===0){
          return res.status(404).send('Product not found')
        }else{
          return res.status(200).send('Product deleted successfully')
        }

      }catch(err){
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
    })
    //Edit the product
    app.put('/productedit/:id', (req, res) => {
      console.log('hiii');
      console.log(req,'reeeeq')
     const  id  = req.params.id;
      const  {name,price}  = req.body;
    
      if (!name || !price) {
        return res.status(400).send('Please provide all required fields');
      }
    
      db.query(
        'UPDATE products SET name = ?, price = ? WHERE id = ?',
        [name, price, id],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
          }
    
          if (result.affectedRows === 0) {
            return res.status(404).send('Product not found');
          }
    
          return res.status(200).send('Product updated successfully');
        }
      );
    });
    
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
