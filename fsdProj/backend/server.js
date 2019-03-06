const express = require('express');
const server = express();
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const userService = require('./services/userService');
const bcrypt = require('bcrypt');
const config = require('./configuration');
const cors = require('cors');
const Post = require('../models/post'); 

const PORT = 3500;

server.use(parser.json());
server.use(parser.urlencoded({ extended: true}));

server.use(cors());

// status api
server.get('/status',(req,res)=>{
    res.json({
        message : 'Service is up'
    });
});

// registration
server.post('/users/register',(req,res)=>{
    const user = req.body;
    userService.signup(user,(err,response)=>{
        if(err){
            res.status(400).json({
                message: err
            })
        }else{
            res.status(200).json({
                message: response
            })
        }
    })
});

// authentication 
server.post('/users/authenticate',(req,res)=>{
    console.log('hitttttttt');
    const email = req.body.username;
    userService.findUser(email,(err,data)=>{
        if(err){
            res.status(401).json({
                message: 'Invalid Credentials'
            });
        }
        else{
            //console.log('Length ',data.length);
            if(data.length === 0){
                res.status(401).json({
                    message: 'Invalid Credentials'
                });
            }else{
                console.log(data);
                let isValidPassword = bcrypt.compareSync(req.body.password,data.password,10);
                if(isValidPassword){
                    //generate jwt token
                    const payload = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: email,
                        password: data.password
                    }
                    let token = jwt.sign(payload,config.secretKey,{
                        expiresIn: '1h'
                    });
                    res.json({
                        message: 'Success',
                        token: token
                    });
                }else{
                    res.status(401).json({
                        message: 'Invalid Credentials'
                    });
                }
            }
        }
    })
});
server.listen(PORT,()=>{
    console.log(`Server is started at ${PORT}`);
});


//Posting

server.post('/newPost', (req, res) => {
    // Check if blog title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Post title is required.' }); // Return error message
    } else {
      // Check if blog body was provided
      if (!req.body.body) {
        res.json({ success: false, message: 'Post body is required.' }); // Return error message
      } else {
        // Check if blog's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Post creator is required.' }); // Return error
        } else {
          // Create the blog object for insertion into database
          const post = new Post({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy // CreatedBy field
          });
          // Save blog into database
          post.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                }
              } else {
                res.json({ success: false, message: err }); // Return general error message
              }
            } else {
              res.json({ success: true, message: 'Post saved!' }); // Return success message
            }
          });
        }
      }
    }
  });

