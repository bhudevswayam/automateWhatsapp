const axios = require('axios');
var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://swayampandya1236:Hgm4dqVLM4KRAIKE@dummydb.kklcpad.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
  name:{
    type: String
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  flag: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('User', userSchema);

app.get("/", function (req, res) {
  res.send(
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
app.post('/webhook', function (req, res) {
  try{
    const jsonData = req.body; // Parse the incoming JSON data
    console.log(jsonData);

    const messages = jsonData.entry[0].changes[0].value.messages;
    const buttonText = messages[0].button ? messages[0].button.text : null;
    const normalText = messages[0].text ? messages[0].text.body.toLowerCase() : null;
    const name = jsonData.entry[0].changes[0].value.contacts[0].profile.name ? jsonData.entry[0].changes[0].value.contacts[0].profile.name : 'User';
    const phnbr = messages[0].from;
    console.log("Incoming webhook (buttonText): " + buttonText);
    console.log("Incoming webhook (normalText): " + normalText);

    if (normalText === "broadcast") {
      console.log("Entering 'broadcast' condition");
    
      const postmanEnvironment = {
        UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
      };
      
      // WhatsApp API endpoint
      const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
    
      // Retrieve all users from the database
      User.find({ flag: true }) // Only select users with flag set to true
        .then(users => {
          console.log('Users found for broadcast:', users);
    
          // Iterate over each user to send the broadcast message
          users.forEach(user => {
            const userPhoneNumber = user.phoneNumber;
    
            // Customize your broadcast message here
            const postData = {
              messaging_product: 'whatsapp',
              to: userPhoneNumber, // Use the user's phone number here
              type: 'template',
              template: {
                name: 'cake_intro',
                language: {
                  code: 'en',
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      {
                        type: "image",
                        image: {
                          link: "https://michaelhyatt.com/wp-content/uploads/2017/11/celebration-1920.jpg"
                        }
                      }
                    ]
                  }
                ]
              },
            };
    
            // Send the broadcast message using axios
            axios.post(apiEndpoint, postData, {
              headers: {
                'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
                'Content-Type': 'application/json',
              }
            })
              .then(response => {
                console.log(`Broadcast message sent successfully to ${userPhoneNumber}`);
              })
              .catch(error => {
                console.error(`Error sending broadcast message to ${userPhoneNumber}:`, error);
              });
          });
        })
        .catch(err => {
          console.error('Error retrieving users for broadcast:', err);
        });
    }
    
    
    

    

    if (normalText !== null && (normalText.includes("hi") || normalText.includes("hello"))) {
      // Postman environment variables
      
      const postmanEnvironment = {
          UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
        };
        
        // WhatsApp API endpoint
        const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
        
        // JSON data for the POST request
        const postData = {
          messaging_product: 'whatsapp',
          to: `${phnbr}`,
          type: 'template',
          template: {
            name: 'cake_hi_reply',
            language: {
              code: 'en',
            },
            components: [
              {
                type: "header",
                parameters: [
                  {
                    type: "image",
                    image: {
                      link: "https://enterprise.press/wp-content/uploads/2020/12/monginis-1600px.jpg"
                    }
                  }
                ]
              }
            ]
          },
        };

        // Check if the user exists in the database
  User.findOne({ phoneNumber: phnbr })
  .then(existingUser => {
    if (existingUser) {
      // User exists, check and update the flag
      if (!existingUser.flag) {
        // If flag is false, update it to true
        existingUser.flag = true;
        existingUser.save()
          .then(() => {
            console.log('User flag set to true for an existing user:', existingUser);
          })
          .catch(error => {
            console.error('Error updating user flag:', error);
          });
      }
      // User is already in the database, no need to add again
    } else {
      // User does not exist, add the user to the database
      const newUser = new User({
        name: name,
        phoneNumber: phnbr,
        flag: true, // Set the flag as needed
      });

      newUser.save()
        .then(() => {
          console.log('New user saved to the database:', newUser);
        })
        .catch((error) => {
          console.error('Error saving new user to the database:', error);
        });
    }

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
        console.error('Error sending message:' + error);
      });
  })
  .catch(error => {
    console.error('Error checking user in the database:', error);
  });
          }

          else if (normalText === "stop") {
            console.log("Entering 'stop' condition");
            // Log to check if user is found
            User.findOne({ phoneNumber: phnbr })
              .then(user => {
                console.log('User found:', user);
                // If 'normalText' is 'stop', set the 'flag' to false
                return User.findOneAndUpdate({ phoneNumber: phnbr }, { flag: false }, { new: true });
              })
              .then(updatedUser => {
                console.log('User flag set to false:', updatedUser);
              })
              .catch(err => {
                console.error('Error updating user flag:', err);
              });
          }
          
          
          
      
      
  


else if (buttonText === "Catalog") {
// Postman environment variables

const postmanEnvironment = {
    UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
  };
  
  // WhatsApp API endpoint
  const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
  
  // JSON data for the POST request
  const postData = {
    messaging_product: 'whatsapp',
    to: `${phnbr}`,
    type: 'template',
    template: {
      name: 'catalog',
      language: {
        code: 'en',
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: "https://www.sheknows.com/wp-content/uploads/2018/08/3._Rainbow_Sprinkes_b.jpeg"
              }
            }
          ]
        }
      ]
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
else if (buttonText === "Special Offers") {
// Postman environment variables

const postmanEnvironment = {
    UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
  };
  
  // WhatsApp API endpoint
  const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
  
  // JSON data for the POST request
  const postData = {
    messaging_product: 'whatsapp',
    to: `${phnbr}`,
    type: 'template',
    template: {
      name: 'special_offer',
      language: {
        code: 'en',
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: "https://i.ibb.co/2vFFJNy/offer-ing.jpg"
              }
            }
          ]
        }
      ]
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

    else if (buttonText === "Birthday Cake") {
      // Postman environment variables
      
      const postmanEnvironment = {
          UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
        };
        
        // WhatsApp API endpoint
        const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
        
        // JSON data for the POST request
        const postData = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          preview_url: true,
          to: `${phnbr}`,
          type: "text",
          text: {
            body : "https://drive.google.com/file/d/1aWCCiC9ONj5zk3_LMvE27FerCdT6STOQ/view?usp=sharing"
          }
        }
        
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
          else if (buttonText === "Anniversary Cake") {
            // Postman environment variables
            
            const postmanEnvironment = {
                UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
              };
              
              // WhatsApp API endpoint
              const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
              
              // JSON data for the POST request
              const postData = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                preview_url: true,
                to: `${phnbr}`,
                type: "text",
                text: {
                  body : "https://drive.google.com/file/d/1xey3wvmXg0mdxuHhMQ0pawdY-mSgfXyG/view?usp=sharing"
                }
              }
              
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
            
                }else if (buttonText === "Special Cake") {
                  // Postman environment variables
                  
                  const postmanEnvironment = {
                      UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
                    };
                    
                    // WhatsApp API endpoint
                    const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                    
                    // JSON data for the POST request
                    const postData = {
                      messaging_product: 'whatsapp',
                      to: `${phnbr}`,
                      type: 'template',
                      template: {
                        name: 'special_offer',
                        language: {
                          code: 'en',
                        },
                        components: [
                          {
                            type: "header",
                            parameters: [
                              {
                                type: "image",
                                image: {
                                  link: "https://i.ibb.co/2vFFJNy/offer-ing.jpg"
                                }
                              }
                            ]
                          }
                        ]
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
    res.status(200).send('success');

  }catch (error) {
    console.error("Error in /test:", error);
    res.sendStatus(500); // Respond with an error status
  }

})

var listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// app.post("/webhook", function (req, response) {
//   try {
//     const jsonData = req.body; // Parse the incoming JSON data
//     console.log(JSON.stringify(jsonData, null, 2));

//     const messages = jsonData.entry[0].changes[0].value.messages;
//     const buttonText = messages[0].button ? messages[0].button.text : null;
//     const normalText = messages[0].text ? messages[0].text.body.toLowerCase() : null;

//     console.log("Incoming webhook (buttonText): " + buttonText);
//     console.log("Incoming webhook (normalText): " + normalText);

//     if (normalText.includes("hi") || normalText.includes("hello")) {
//             // Postman environment variables
            
//             const postmanEnvironment = {
//                 UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//               };
              
//               // WhatsApp API endpoint
//               const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
              
//               // JSON data for the POST request
//               const postData = {
//                 messaging_product: 'whatsapp',
//                 to: `${phnbr}`,
//                 type: 'template',
//                 template: {
//                   name: 'cake_hi_reply',
//                   language: {
//                     code: 'en',
//                   },
//                   components: [
//                     {
//                       type: "header",
//                       parameters: [
//                         {
//                           type: "image",
//                           image: {
//                             link: "https://enterprise.press/wp-content/uploads/2020/12/monginis-1600px.jpg"
//                           }
//                         }
//                       ]
//                     }
//                   ]
//                 },
//               };
              
//               // Send the POST request using axios
//               axios.post(apiEndpoint, postData, {
//                 headers: {
//                   'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                   'Content-Type': 'application/json',
//                 }
//               })
//                 .then(response => {
//                   console.log('Message sent successfully:');
//                 })
//                 .catch(error => {
//                   console.error('Error sending message:' +error);
//                 });
            
//                 }
                
            
            
        
    

//      else if (buttonText === "Catalog") {
//       // Postman environment variables
      
//       const postmanEnvironment = {
//           UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//         };
        
//         // WhatsApp API endpoint
//         const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
        
//         // JSON data for the POST request
//         const postData = {
//           messaging_product: 'whatsapp',
//           to: `${phnbr}`,
//           type: 'template',
//           template: {
//             name: 'pickup',
//             language: {
//               code: 'en_US',
//             },
//           },
//         };
        
//         // Send the POST request using axios
//         axios.post(apiEndpoint, postData, {
//           headers: {
//             'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//             'Content-Type': 'application/json',
//           }
//         })
//           .then(response => {
//             console.log('Message sent successfully:');
//           })
//           .catch(error => {
//             console.error('Error sending message:' +error);
//           });
      
//           }
//   else if (buttonText === "Special Offers") {
//       // Postman environment variables
      
//       const postmanEnvironment = {
//           UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//         };
        
//         // WhatsApp API endpoint
//         const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
        
//         // JSON data for the POST request
//         const postData = {
//           messaging_product: 'whatsapp',
//           to: `${phnbr}`,
//           type: 'template',
//           template: {
//             name: 'delivery',
//             language: {
//               code: 'en_US',
//             },
//           },
//         };
        
//         // Send the POST request using axios
//         axios.post(apiEndpoint, postData, {
//           headers: {
//             'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//             'Content-Type': 'application/json',
//           }
//         })
//           .then(response => {
//             console.log('Message sent successfully:');
//           })
//           .catch(error => {
//             console.error('Error sending message:' +error);
//           });
      
//           }
    


//     response.sendStatus(200);
//   } catch (error) {
//     console.error("Error in /webhook:", error);
//     response.sendStatus(500); // Respond with an error status
//   }
// });


    


  

 







// app.post('/webhook', async function (request, response) {
//   try {
//     const jsonData = request.body; // Parse the incoming JSON data
//     console.log(JSON.stringify(jsonData, null, 2));
//     console.dir(jsonData, { depth: null });

//     if (jsonData.entry && jsonData.entry.length > 0) {
//       const changes = jsonData.entry[0].changes;
//       if (changes && changes.length > 0) {
//         const messages = changes[0].value.messages;
//         if (messages && messages.length > 0) {
//           for (const message of messages) {
//             if (message.type === 'text') {
//               const textBody = message.text.body.toLowerCase();
//               console.log('Incoming webhook: ' + textBody);

//               if (textBody.includes('hi') || textBody.includes('hello')) {
//                 // Handle "hi" or "hello" message

//                 // Postman environment variables
//                 const postmanEnvironment = {
//                   UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//                 };

//                 // WhatsApp API endpoint
//                 const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';

//                 // JSON data for the POST request
//                 const postData = {
//                   messaging_product: 'whatsapp',
//                   to: `${phnbr}`,
//                   type: 'template',
//                   template: {
//                     name: 'cake_hi_reply',
//                     language: {
//                       code: 'en',
//                     },
//                     components: [
//                       {
//                         type: "header",
//                         parameters: [
//                           {
//                             type:"image",
//                                 image: {
//                                   link: "https://enterprise.press/wp-content/uploads/2020/12/monginis-1600px.jpg"
//                                 }
//                               }
//                             ]
//                           }
//                         ]
//                       },
//                     };
    
//                     // Send the POST request using axios
//                     axios.post(apiEndpoint, postData, {
//                       headers: {
//                         'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                         'Content-Type': 'application/json',
//                       }
//                     })
//                       .then(response => {
//                         console.log('Message sent successfully:');
//                       })
//                       .catch(error => {
//                         console.error('Error sending message:' + error);
//                       });
    
//                   } else if (message.type === 'button') {
//                     const buttonText = message.button.text.toLowerCase();
    
//                     // Handle based on the button text
//                     if (buttonText === 'catalog') {
//                       // Handle "Catalog" button
    
//                       // Postman environment variables
//                       const postmanEnvironment = {
//                         UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//                       };
    
//                       // WhatsApp API endpoint
//                       const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
    
//                       // JSON data for the POST request
//                       const postData = {
//                         messaging_product: 'whatsapp',
//                         to: `${phnbr}`,
//                         type: 'template',
//                         template: {
//                           name: 'pickup',
//                           language: {
//                             code: 'en_US',
//                           },
//                         },
//                       };
    
//                       // Send the POST request using axios
//                       axios.post(apiEndpoint, postData, {
//                         headers: {
//                           'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                           'Content-Type': 'application/json',
//                         }
//                       })
//                         .then(response => {
//                           console.log('Message sent successfully:');
//                         })
//                         .catch(error => {
//                           console.error('Error sending message:' + error);
//                         });
    
//                     } else if (buttonText === 'special offers') {
//                       // Handle "Special Offers" button
    
//                       // Postman environment variables
//                       const postmanEnvironment = {
//                         UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//                       };
    
//                       // WhatsApp API endpoint
//                       const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
    
//                       // JSON data for the POST request
//                       const postData = {
//                         messaging_product: 'whatsapp',
//                         to: `${phnbr}`,
//                         type: 'template',
//                         template: {
//                           name: 'delivery',
//                           language: {
//                             code: 'en_US',
//                           },
//                         },
//                       };
    
//                       // Send the POST request using axios
//                       axios.post(apiEndpoint, postData, {
//                         headers: {
//                           'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                           'Content-Type': 'application/json',
//                         }
//                       })
//                         .then(response => {
//                           console.log('Message sent successfully:');
//                         })
//                         .catch(error => {
//                           console.error('Error sending message:' + error);
//                         });
    
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
    
//         response.sendStatus(200);
//       } catch (error) {
//         console.error('Error in /webhook:', error);
//         response.sendStatus(500); // Respond with an error status
//       }
//     });


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


// app.post('/webhook', async function (req, res) {
//   try {
//     const jsonData = req.body;
//     console.log(jsonData);

//     if (jsonData.entry && jsonData.entry.length > 0) {
//       const changes = jsonData.entry[0].changes;

//       if (changes && changes.length > 0) {
//         const messages = changes[0].value.messages;

//         if (messages && messages.length > 0) {
//           const textBody = messages[0].text.body.toLowerCase();
//           console.log("Incoming webhook: " + textBody);

//           // Extract email from textBody
//           const emailMatch = textBody.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
//           const email = emailMatch ? emailMatch[0] : null;
//             const postmanEnvironment = {
//                 UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//               };
//           if (email) {
//             // Connect to MongoDB
//             const client = new MongoClient(mongoURI);
//             await client.connect();

//             // Access the database
//             const db = client.db('testdata');

//             // Access the collection (replace 'your-collection-name' with the actual name)
//             const collection = db.collection('sales');

//             // Find data from MongoDB using email
//             const mongoData = await collection.findOne({ 'customer.email': email });


//             if (!mongoData) {
//               // Handle the case where data is not found
//               console.log(`Data not found in MongoDB for email: ${email}`);
//             } else {
//               // WhatsApp API endpoint
//               const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';

//               // JSON data for the POST request
//               const postData = {
//                 messaging_product: 'whatsapp',
//                 recipient_type: "individual",
//                 to: `${phnbr}`,
//                 type: 'text',
//                 // template: {
//                 //   name: "TEMPLATE_NAME",
//                 //   language: {
//                 //     code: "LANGUAGE_AND_LOCALE_CODE"
//                 //   },
//                 //   components: [
//                 //     {
//                 //       type: "body",
//                 //       parameters: [
//                 //         {
//                 //           type: "text",
//                 //           text: "text-string"
//                 //         },
//                 //         {
//                 //           type: "currency",
//                 //           currency: {
//                 //             "fallback_value": "VALUE",
//                 //             "code": "USD",
//                 //             "amount_1000": NUMBER
//                 //           }
//                 //         },
//                 //         {
//                 //           type: "date_time",
//                 //           date_time: {
//                 //             "fallback_value": "DATE"
//                 //           }
//                 //         }
//                 //       ]
//                 //     }
//                 //   ]
//                 // }    
//                 text: { 
//                   preview_url: false,
//                   body: `Your Store Location is: *${mongoData.storeLocation}*. 
// Your last bought item was *${mongoData.items[0].name}* with quantity *${mongoData.items[0].quantity}* and sub total of *${mongoData.items[0].price}*` // Replace 'yourField' with the actual field name from MongoDB
//                 }
//               };

//               // Send the POST request using axios
//               axios.post(apiEndpoint, postData, {
//                 headers: {
//                   'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                   'Content-Type': 'application/json',
//                 }
//               })
//                 .then(response => {
//                   console.log('Message sent successfully:');
//                 })
//                 .catch(error => {
//                   console.error('Error sending message:' + error);
//                 });
//             }

//             // Close the MongoDB connection
//             client.close();
//           } else {
//             console.log('No email found in the textBody');
//           }
//         }
//       }
//     }
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error in /webhook:", error);
//     res.sendStatus(500); // Respond with an error status
//   }
// });

// ===================Payload=================



// {
//   "object":"whatsapp_business_account",
//   "entry":[
//      {
//         "id":"105774542583244",
//         "changes":[
//            {
//               "value":{
//                  "messaging_product":"whatsapp",
//                  "metadata":{
//                     "display_phone_number":"15551007051",
//                     "phone_number_id":"107124295779726"
//                  },
//                  "contacts":[
//                     {
//                        "profile":{
//                           "name":"Swayam Pandya"
//                        },
//                        "wa_id":`${phnbr}`
//                     }
//                  ],
//                  "messages":[
//                     {
//                        "context":{
//                           "from":"15551007051",
//                           "id":"wamid.HBgMOTE4ODY2MjcxNjAyFQIAERgSMkY0MTlFMkIzMDA2RjJFNDk3AA=="
//                        },
//                        "from":`${phnbr}`,
//                        "id":"wamid.HBgMOTE4ODY2MjcxNjAyFQIAEhggNzMxMzc5MTVDNUQ2NjM0Q0ZGQkYwM0E1NjhGMjJBODQA",
//                        "timestamp":"1701944780",
//                        "type":"button",
//                        "button":{
//                           "payload":"Catalog",
//                           "text":"Catalog"
//                        }
//                     }
//                  ]
//               },
//               "field":"messages"
//            }
//         ]
//      }
//   ]
// }




// ====================================================================================================================== PREVIOUS GIT 
// ======================================================================================================================
// ==============================================PREVIOUS GIT========================================================================
// ======================================================================================================================
// ======================================================================================================================




// const axios = require('axios');
// var express = require("express");
// var bodyParser = require("body-parser");
// const MongoClient = require('mongodb').MongoClient;

// const mongoURI = "mongodb+srv://swayampandya1236:Hgm4dqVLM4KRAIKE@dummydb.kklcpad.mongodb.net/?retryWrites=true&w=majority";

// const dbName = 'testdata';
// var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.get("/", function (req, res) {
//   res.send(
//     "Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!"
//   );
// });

// app.get("/webhook", function (req, res) {
//   if (
//     req.query["hub.mode"] == "subscribe" &&
//     req.query["hub.verify_token"] == "mysecret"
//   ) {
//     res.send(req.query["hub.challenge"]);
//   } else {
//     res.sendStatus(400);
//   }
// });
// // app.post('/webhook', async function (req, res) {
// //   try {
// //     const jsonData = req.body;
// //     console.log(jsonData);

// //     if (jsonData.entry && jsonData.entry.length > 0) {
// //       const changes = jsonData.entry[0].changes;

// //       if (changes && changes.length > 0) {
// //         const messages = changes[0].value.messages;

// //         if (messages && messages.length > 0) {
// //           const textBody = messages[0].text.body.toLowerCase();
// //           console.log("Incoming webhook: " + textBody);

// //           // Extract email from textBody
// //           const emailMatch = textBody.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
// //           const email = emailMatch ? emailMatch[0] : null;
// //             const postmanEnvironment = {
// //                 UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
// //               };
// //           if (email) {
// //             // Connect to MongoDB
// //             const client = new MongoClient(mongoURI);
// //             await client.connect();

// //             // Access the database
// //             const db = client.db('testdata');

// //             // Access the collection (replace 'your-collection-name' with the actual name)
// //             const collection = db.collection('sales');

// //             // Find data from MongoDB using email
// //             const mongoData = await collection.findOne({ 'customer.email': email });


// //             if (!mongoData) {
// //               // Handle the case where data is not found
// //               console.log(`Data not found in MongoDB for email: ${email}`);
// //             } else {
// //               // WhatsApp API endpoint
// //               const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';

// //               // JSON data for the POST request
// //               const postData = {
// //                 messaging_product: 'whatsapp',
// //                 recipient_type: "individual",
// //                 to: `${phnbr}`,
// //                 type: 'text',
// //                 // template: {
// //                 //   name: "TEMPLATE_NAME",
// //                 //   language: {
// //                 //     code: "LANGUAGE_AND_LOCALE_CODE"
// //                 //   },
// //                 //   components: [
// //                 //     {
// //                 //       type: "body",
// //                 //       parameters: [
// //                 //         {
// //                 //           type: "text",
// //                 //           text: "text-string"
// //                 //         },
// //                 //         {
// //                 //           type: "currency",
// //                 //           currency: {
// //                 //             "fallback_value": "VALUE",
// //                 //             "code": "USD",
// //                 //             "amount_1000": NUMBER
// //                 //           }
// //                 //         },
// //                 //         {
// //                 //           type: "date_time",
// //                 //           date_time: {
// //                 //             "fallback_value": "DATE"
// //                 //           }
// //                 //         }
// //                 //       ]
// //                 //     }
// //                 //   ]
// //                 // }    
// //                 text: { 
// //                   preview_url: false,
// //                   body: `Your Store Location is: *${mongoData.storeLocation}*. 
// // Your last bought item was *${mongoData.items[0].name}* with quantity *${mongoData.items[0].quantity}* and sub total of *${mongoData.items[0].price}*` // Replace 'yourField' with the actual field name from MongoDB
// //                 }
// //               };

// //               // Send the POST request using axios
// //               axios.post(apiEndpoint, postData, {
// //                 headers: {
// //                   'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
// //                   'Content-Type': 'application/json',
// //                 }
// //               })
// //                 .then(response => {
// //                   console.log('Message sent successfully:');
// //                 })
// //                 .catch(error => {
// //                   console.error('Error sending message:' + error);
// //                 });
// //             }

// //             // Close the MongoDB connection
// //             client.close();
// //           } else {
// //             console.log('No email found in the textBody');
// //           }
// //         }
// //       }
// //     }
// //     res.sendStatus(200);
// //   } catch (error) {
// //     console.error("Error in /webhook:", error);
// //     res.sendStatus(500); // Respond with an error status
// //   }
// // });
// app.post("/webhook", function (request, response) {
//   try {
//     const jsonData = request.body; // Parse the incoming JSON data
//     console.log(JSON.stringify(jsonData, null, 2));
//     console.dir(jsonData, { depth: null });

//     if (jsonData.entry && jsonData.entry.length > 0) {
//       const changes = jsonData.entry[0].changes;
//       if (changes && changes.length > 0) {
//         const messages = changes[0].value.messages;
//         if (messages && messages.length > 0) {
//           const textBody = messages[0].text.body.toLowerCase();
//           console.log("Incoming webhook: " + textBody);

//             if (textBody.includes("hi") || textBody.includes("hello")) {
//             // Postman environment variables
            
//             const postmanEnvironment = {
//                 UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//               };
              
//               // WhatsApp API endpoint
//               const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
              
//               // JSON data for the POST request
//               const postData = {
//                 messaging_product: 'whatsapp',
//                 to: `${phnbr}`,
//                 type: 'template',
//                 template: {
//                   name: 'cake_hi_reply',
//                   language: {
//                     code: 'en',
//                   },
//                   components: [
//                     {
//                       type: "header",
//                       parameters: [
//                         {
//                           type: "image",
//                           image: {
//                             link: "https://enterprise.press/wp-content/uploads/2020/12/monginis-1600px.jpg"
//                           }
//                         }
//                       ]
//                     }
//                   ]
//                 },
//               };
              
//               // Send the POST request using axios
//               axios.post(apiEndpoint, postData, {
//                 headers: {
//                   'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                   'Content-Type': 'application/json',
//                 }
//               })
//                 .then(response => {
//                   console.log('Message sent successfully:');
//                 })
//                 .catch(error => {
//                   console.error('Error sending message:' +error);
//                 });
            
//                 }
//                 if (jsonData.entry[0].changes[0].value.messages[0].button.text.includes("Catalog")) {
//                     // Postman environment variables
                    
//                     const postmanEnvironment = {
//                         UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//                       };
                      
//                       // WhatsApp API endpoint
//                       const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                      
//                       // JSON data for the POST request
//                       const postData = {
//                         messaging_product: 'whatsapp',
//                         to: `${phnbr}`,
//                         type: 'template',
//                         template: {
//                           name: 'pickup',
//                           language: {
//                             code: 'en_US',
//                           },
//                         },
//                       };
                      
//                       // Send the POST request using axios
//                       axios.post(apiEndpoint, postData, {
//                         headers: {
//                           'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                           'Content-Type': 'application/json',
//                         }
//                       })
//                         .then(response => {
//                           console.log('Message sent successfully:');
//                         })
//                         .catch(error => {
//                           console.error('Error sending message:' +error);
//                         });
                    
//                         }
//                 if (jsonData.entry[0].changes[0].value.messages[0].button.text.includes("Special Offers")) {
//                     // Postman environment variables
                    
//                     const postmanEnvironment = {
//                         UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//                       };
                      
//                       // WhatsApp API endpoint
//                       const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                      
//                       // JSON data for the POST request
//                       const postData = {
//                         messaging_product: 'whatsapp',
//                         to: `${phnbr}`,
//                         type: 'template',
//                         template: {
//                           name: 'delivery',
//                           language: {
//                             code: 'en_US',
//                           },
//                         },
//                       };
                      
//                       // Send the POST request using axios
//                       axios.post(apiEndpoint, postData, {
//                         headers: {
//                           'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                           'Content-Type': 'application/json',
//                         }
//                       })
//                         .then(response => {
//                           console.log('Message sent successfully:');
//                         })
//                         .catch(error => {
//                           console.error('Error sending message:' +error);
//                         });
                    
//                         }
//                         if (textBody.includes("3")) {
//                             // Postman environment variables
                            
//                             const postmanEnvironment = {
//                                 UserAccessToken: 'EAAP0v7FwAB0BO0QXk8zKVSzt5Of1wO7poiSRPgSA35KmBZCICRBrGKyRUXCz5j6qBSZCCSKrZCT3LSZAS65cE7gVGDkvGnLOOtHBZBw6WUN3m32vtDBfkFPjGyW4cxUZADehutc3a4DDMQSlIfSz7MhNVlr44SRB8LtEu4ns01yJ4aNIZCv8R6gpVikZCoEwZA8Qp',
//                               };
                              
//                               // WhatsApp API endpoint
//                               const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
                              
//                               // JSON data for the POST request
//                               const postData = {
//                                 messaging_product: 'whatsapp',
//                                 to: `${phnbr}`,
//                                 type: 'template',
//                                 template: {
//                                   name: 'home_delivery',
//                                   language: {
//                                     code: 'en_US',
//                                   },
//                                 },
//                               };
                              
//                               // Send the POST request using axios
//                               axios.post(apiEndpoint, postData, {
//                                 headers: {
//                                   'Authorization': `Bearer ${postmanEnvironment.UserAccessToken}`,
//                                   'Content-Type': 'application/json',
//                                 }
//                               })
//                                 .then(response => {
//                                   console.log('Message sent successfully:');
//                                 })
//                                 .catch(error => {
//                                   console.error('Error sending message:' +error);
//                                 });
                            
//                                 }
//             }
            
//         }
//     }
//     response.sendStatus(200);
//   } catch (error) {
//     console.error("Error in /webhook:", error);
//     response.sendStatus(500); // Respond with an error status
//   }
// });

// var listener = app.listen(process.env.PORT || 3001, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });









// // const axios = require('axios');
// // const express = require('express');
// // const bodyParser = require('body-parser');
// // const mongoose = require('mongoose');

// // const app = express();
// // app.use(bodyParser.urlencoded({ extended: false }));
// // app.use(bodyParser.json());

// // // Connect to your MongoDB database
// // mongoose.connect('mongodb+srv://swayampandya1236:Hgm4dqVLM4KRAIKE@dummydb.kklcpad.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// // const db = mongoose.connection;

// // db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// // db.once('open', () => {
// //   console.log('Connected to MongoDB');
// // });

// // // Define a mongoose schema for your data
// // const purchaseSchema = new mongoose.Schema({
// //   saleDate: Date,
// //   items: [
// //     {
// //       name: String,
// //       tags: [String],
// //       price: Number,
// //       quantity: Number,
// //     },
// //   ],
// //   storeLocation: String,
// //   customer: {
// //     gender: String,
// //     age: Number,
// //     email: String,
// //     satisfaction: Number,
// //   },
// //   couponUsed: Boolean,
// //   purchaseMethod: String,
// // });

// // const Purchase = mongoose.model('Purchase', purchaseSchema);

// // app.get('/', function (request, response) {
// //   response.send("Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!");
// // });

// // app.get('/webhook', function (req, res) {
// //   if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'mysecret') {
// //     res.send(req.query['hub.challenge']);
// //   } else {
// //     res.sendStatus(400);
// //   }
// // });

// // app.post('/webhook', async function (request, response) {
// //   try {
// //     const jsonData = request.body; // Parse the incoming JSON data

// //     if (jsonData.entry && jsonData.entry.length > 0) {
// //       const changes = jsonData.entry[0].changes;
// //       if (changes && changes.length > 0) {
// //         const messages = changes[0].value.messages;
// //         if (messages && messages.length > 0) {
// //           const textBody = messages[0].text.body.toLowerCase();
// //           console.log('Incoming webhook: ' + textBody);

// //           if (textBody.includes('email:')) {
// //             const userEmail = textBody.replace('email:', '').trim();

// //             // Query the MongoDB database for the user with the provided email
// //             const userPurchase = await Purchase.findOne({ 'customer.email': userEmail });

// //             if (userPurchase) {
// //               // Send a response based on the user's purchase information
// //               console.log('User found:', userPurchase);
// //               // You can customize this part to send a specific response based on the user's purchase information
// //             } else {
// //               console.log('User not found');
// //               // Handle the case when the user is not found in the database
// //             }
// //           }
// //         }
// //       }
// //     }

// //     response.sendStatus(200);
// //   } catch (error) {
// //     console.error('Error in /webhook:', error);
// //     response.sendStatus(500); // Respond with an error status
// //   }
// // });

// // const listener = app.listen(process.env.PORT || 3000, function () {
// //   console.log('Your app is listening on port ' + listener.address().port);
// // });



// // ===================Payload=================



// // {
// //     "object": "whatsapp_business_account",
// //     "entry": [
// //       {
// //         "id": "105774542583244",
// //         "changes": [
// //           {
// //             "value": {
// //               "messaging_product": "whatsapp",
// //               "metadata": {
// //                 "display_phone_number": "15551007051",
// //                 "phone_number_id": "107124295779726"
// //               },
// //               "contacts": [
// //                 {
// //                   "profile": {
// //                     "name": "Swayam Pandya"
// //                   },
// //                   "wa_id": `${phnbr}`
// //                 }
// //               ],
// //               "messages": [
// //                 {
// //                   "context": {
// //                     "from": "15551007051",
// //                     "id": "wamid.HBgMOTE4ODY2MjcxNjAyFQIAERgSMkY0MTlFMkIzMDA2RjJFNDk3AA=="
// //                   },
// //                   "from": `${phnbr}`,
// //                   "id": "wamid.HBgMOTE4ODY2MjcxNjAyFQIAEhggNzMxMzc5MTVDNUQ2NjM0Q0ZGQkYwM0E1NjhGMjJBODQA",
// //                   "timestamp": "1701944780",
// //                   "type": "button",
// //                   "button": {
// //                     "payload": "Catalog",
// //                     "text": "Catalog"
// //                   }
// //                 }
// //               ]
// //             },
// //             "field": "messages"
// //           }
// //         ]
// //       }
// //     ]
// //   }