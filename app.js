const axios = require('axios');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
let myName = "PANDYA SWAYAM"
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send(
    "Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!"
  );
});

app.get("/webhook", function (req, res) {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == "mysecret"
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhook", function (request, response) {
  try {
    const jsonData = request.body; // Parse the incoming JSON data
    console.log(jsonData);
    if (jsonData.entry && jsonData.entry.length > 0) {
      const changes = jsonData.entry[0].changes;
      if (changes && changes.length > 0) {
        const messages = changes[0].value.messages;
        if (messages && messages.length > 0) {
          const textBody = messages[0].text.body.toLowerCase();
          console.log("Incoming webhook: " + textBody);

            if (textBody.includes("hi") || textBody.includes("hello")) {
            // Postman environment variables
            
            const postmanEnvironment = {
                UserAccessToken: 'EAAN8IwQAAloBOxxvPqXjWf3kklt1r4tQYp4xnvKSykqYzVX5i1LKPzCp5rE8kzUJbdttlKtbUx5occIZC4SZAwPy4VwZBI9k4G2C9ZACfwoNbiOulOLXH24REjZB8JvqeZCpiltoTsAcasn32WYdZCxA9R5K7RRRhuMkU2llaTVHrpaguwyCz0lNt8xuzq0BVPFO0Ee67ZAcbmYXHIoVmxAZD',
              };
              
              // WhatsApp API endpoint
              const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
              
              // JSON data for the POST request
              const postData = {
                messaging_product: 'whatsapp',
                to: '918866271602',
                type: 'template',
                template: {
                  name: 'intro_message',
                  language: {
                    code: 'en',
                  },
                },
              };
              
              // Send the POST request using axios
              axios.post(apiEndpoint, postData, {
                headers: {
                  'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
                  'Content-Type': 'application/json',
                }
              })
                .then(response => {
                  console.log('Message sent successfully:');
                })
                .catch(error => {
                  console.error('Error sending message:' +error);
                });
            
                }
                if (textBody.includes("1")) {
                    // Postman environment variables
                    
                    const postmanEnvironment = {
                        UserAccessToken: 'EAAN8IwQAAloBOxxvPqXjWf3kklt1r4tQYp4xnvKSykqYzVX5i1LKPzCp5rE8kzUJbdttlKtbUx5occIZC4SZAwPy4VwZBI9k4G2C9ZACfwoNbiOulOLXH24REjZB8JvqeZCpiltoTsAcasn32WYdZCxA9R5K7RRRhuMkU2llaTVHrpaguwyCz0lNt8xuzq0BVPFO0Ee67ZAcbmYXHIoVmxAZD',
                      };
                      
                      // WhatsApp API endpoint
                      const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                      
                      // JSON data for the POST request
                      const postData = {
                        messaging_product: 'whatsapp',
                        recipient_type: "individual",
                        to: '918866271602',
                        type: 'text',
                        text: { // the text object
                          preview_url: false,
                          body: `HII THIS IS SWAYAM FROM CUBENTINFOTECH ${myName}`
                          }
                      };
                      
                      // Send the POST request using axios
                      axios.post(apiEndpoint, postData, {
                        headers: {
                          'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
                          'Content-Type': 'application/json',
                        }
                      })
                        .then(response => {
                          console.log('Message sent successfully:');
                        })
                        .catch(error => {
                          console.error('Error sending message:' +error);
                        });
                    
                        }
                if (textBody.includes("2")) {
                    // Postman environment variables
                    
                    const postmanEnvironment = {
                        UserAccessToken: 'EAAN8IwQAAloBOxxvPqXjWf3kklt1r4tQYp4xnvKSykqYzVX5i1LKPzCp5rE8kzUJbdttlKtbUx5occIZC4SZAwPy4VwZBI9k4G2C9ZACfwoNbiOulOLXH24REjZB8JvqeZCpiltoTsAcasn32WYdZCxA9R5K7RRRhuMkU2llaTVHrpaguwyCz0lNt8xuzq0BVPFO0Ee67ZAcbmYXHIoVmxAZD',
                      };
                      
                      // WhatsApp API endpoint
                      const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                      
                      // JSON data for the POST request
                      const postData = {
                        messaging_product: 'whatsapp',
                        to: '918866271602',
                        type: 'template',
                        template: {
                          name: 'delivery',
                          language: {
                            code: 'en_US',
                          },
                        },
                      };
                      
                      // Send the POST request using axios
                      axios.post(apiEndpoint, postData, {
                        headers: {
                          'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
                          'Content-Type': 'application/json',
                        }
                      })
                        .then(response => {
                          console.log('Message sent successfully:');
                        })
                        .catch(error => {
                          console.error('Error sending message:' +error);
                        });
                    
                        }
                        if (textBody.includes("3")) {
                            // Postman environment variables
                            
                            const postmanEnvironment = {
                                UserAccessToken: 'EAAN8IwQAAloBOxxvPqXjWf3kklt1r4tQYp4xnvKSykqYzVX5i1LKPzCp5rE8kzUJbdttlKtbUx5occIZC4SZAwPy4VwZBI9k4G2C9ZACfwoNbiOulOLXH24REjZB8JvqeZCpiltoTsAcasn32WYdZCxA9R5K7RRRhuMkU2llaTVHrpaguwyCz0lNt8xuzq0BVPFO0Ee67ZAcbmYXHIoVmxAZD',
                              };
                              
                              // WhatsApp API endpoint
                              const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                              
                              // JSON data for the POST request
                              const postData = {
                                messaging_product: 'whatsapp',
                                to: '918866271602',
                                type: 'template',
                                template: {
                                  name: 'home_delivery',
                                  language: {
                                    code: 'en_US',
                                  },
                                },
                              };
                              
                              // Send the POST request using axios
                              axios.post(apiEndpoint, postData, {
                                headers: {
                                  'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
                                  'Content-Type': 'application/json',
                                }
                              })
                                .then(response => {
                                  console.log('Message sent successfully:');
                                })
                                .catch(error => {
                                  console.error('Error sending message:' +error);
                                });
                            
                                }
            }
            
        }
    }
    response.sendStatus(200);
  } catch (error) {
    console.error("Error in /webhook:", error);
    response.sendStatus(500); // Respond with an error status
  }
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});









// const axios = require('axios');
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Connect to your MongoDB database
// mongoose.connect('mongodb+srv://swayampandya1236:Hgm4dqVLM4KRAIKE@dummydb.kklcpad.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Define a mongoose schema for your data
// const purchaseSchema = new mongoose.Schema({
//   saleDate: Date,
//   items: [
//     {
//       name: String,
//       tags: [String],
//       price: Number,
//       quantity: Number,
//     },
//   ],
//   storeLocation: String,
//   customer: {
//     gender: String,
//     age: Number,
//     email: String,
//     satisfaction: Number,
//   },
//   couponUsed: Boolean,
//   purchaseMethod: String,
// });

// const Purchase = mongoose.model('Purchase', purchaseSchema);

// app.get('/', function (request, response) {
//   response.send("Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!");
// });

// app.get('/webhook', function (req, res) {
//   if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'mysecret') {
//     res.send(req.query['hub.challenge']);
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.post('/webhook', async function (request, response) {
//   try {
//     const jsonData = request.body; // Parse the incoming JSON data

//     if (jsonData.entry && jsonData.entry.length > 0) {
//       const changes = jsonData.entry[0].changes;
//       if (changes && changes.length > 0) {
//         const messages = changes[0].value.messages;
//         if (messages && messages.length > 0) {
//           const textBody = messages[0].text.body.toLowerCase();
//           console.log('Incoming webhook: ' + textBody);

//           if (textBody.includes('email:')) {
//             const userEmail = textBody.replace('email:', '').trim();

//             // Query the MongoDB database for the user with the provided email
//             const userPurchase = await Purchase.findOne({ 'customer.email': userEmail });

//             if (userPurchase) {
//               // Send a response based on the user's purchase information
//               console.log('User found:', userPurchase);
//               // You can customize this part to send a specific response based on the user's purchase information
//             } else {
//               console.log('User not found');
//               // Handle the case when the user is not found in the database
//             }
//           }
//         }
//       }
//     }

//     response.sendStatus(200);
//   } catch (error) {
//     console.error('Error in /webhook:', error);
//     response.sendStatus(500); // Respond with an error status
//   }
// });

// const listener = app.listen(process.env.PORT || 3000, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
