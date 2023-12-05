const axios = require('axios');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

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
                UserAccessToken: 'EAAN8IwQAAloBO7MQob9Oz74ZB0DQNXvdnVpx9kjpUS0n0DeTVc3epuZBFOP4LMrs1ddlSeX0xX9HCcEKeUO1KZBxsExIgp0RwsTjKMpoFf6XZA2jOjfU518wK943ILPFUPZBLeZCBug9YKZCyEaWXIsSUcA6wMhmkawi2ZANB9mAXVBY7UwAlvWo6UMSuSCe4Gs2Cw14ai851dfa3QGpf4AZD',
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
                        UserAccessToken: 'EAAP0v7FwAB0BO0btd7IpbmJNfvK82DzNfAIe8mWtODB34bQW9DmRO5s2pxMYMHS6TkZBcYvwogspnHiJEN7lXcpX9nPx9ZC8nI7XNkGeqUEhZCzHoZA9NgaLGbhRR1FgQXBC4hDDK6dcqXpDk0MjCaYyOfL7S8sEjjSwyxdCsLNJ7Ri9CQZBNHlbrZAfPSqYyzYUiisno4ylT9KbTePsOC',
                      };
                      
                      // WhatsApp API endpoint
                      const apiEndpoint = 'https://graph.facebook.com/v17.0/104504676089992/messages';
                      
                      // JSON data for the POST request
                      const postData = {
                        messaging_product: 'whatsapp',
                        to: '918866271602',
                        type: 'template',
                        template: {
                          name: 'pickup',
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
                if (textBody.includes("2")) {
                    // Postman environment variables
                    
                    const postmanEnvironment = {
                        UserAccessToken: 'EAAN8IwQAAloBO7MQob9Oz74ZB0DQNXvdnVpx9kjpUS0n0DeTVc3epuZBFOP4LMrs1ddlSeX0xX9HCcEKeUO1KZBxsExIgp0RwsTjKMpoFf6XZA2jOjfU518wK943ILPFUPZBLeZCBug9YKZCyEaWXIsSUcA6wMhmkawi2ZANB9mAXVBY7UwAlvWo6UMSuSCe4Gs2Cw14ai851dfa3QGpf4AZD',
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
                                UserAccessToken: 'EAAN8IwQAAloBO7MQob9Oz74ZB0DQNXvdnVpx9kjpUS0n0DeTVc3epuZBFOP4LMrs1ddlSeX0xX9HCcEKeUO1KZBxsExIgp0RwsTjKMpoFf6XZA2jOjfU518wK943ILPFUPZBLeZCBug9YKZCyEaWXIsSUcA6wMhmkawi2ZANB9mAXVBY7UwAlvWo6UMSuSCe4Gs2Cw14ai851dfa3QGpf4AZD',
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
// var express = require('express');
// var bodyParser = require('body-parser');

// var app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Postman environment variables
// const postmanEnvironment = {
//   UserAccessToken: 'EAAN8IwQAAloBO0YsARG6f3RpPcArZCaSJNrEgDB5Aw3hyRbZByuQDwls5RF9RGWZCDdVceZAzZBO4v6YJ6xG7mi7I51L7wVcSN2RvyZAj1O7FZBb4tPd57pSyZAoyyj84ZBlhMsLkP2UlhSC226bDUwQhFWZB0av4GKWdIxMYJrCZBxZCEEkhenB9ZASIZAIupkkyNra6dLZAg54yQL1DaA5puCr1IZD', // Replace with your actual user access token
// };

// app.get('/', function (request, response) {
//   response.send('Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!');
// });

// app.get('/webhook', function (req, res) {
//   if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'mysecret') {
//     res.send(req.query['hub.challenge']);
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.post('/webhook', function (request, response) {
//   try {
//     const jsonData = request.body; // Parse the incoming JSON data

//     if (jsonData.entry && jsonData.entry.length > 0) {
//       const changes = jsonData.entry[0].changes;
//       if (changes && changes.length > 0) {
//         const messages = changes[0].value.messages;
//         if (messages && messages.length > 0) {
//           const textBody = messages[0].text.body.toLowerCase();
//           console.log('Incoming webhook: ' + textBody);

//           if (textBody.includes('hi') || textBody.includes('hello')) {
//             sendMessage('intro_message');
//           } else if (textBody.includes('1')) {
//             sendMessage('pickup');
//           } else if (textBody.includes('2')) {
//             sendMessage('delivery');
//           } else if (textBody.includes('3')) {
//             sendMessage('home_delivery');
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

// function sendMessage(templateName) {
//   const apiEndpoint = 'https://graph.facebook.com/v17.0/107124295779726/messages';
//   const postData = {
//     messaging_product: 'whatsapp',
//     to: '918866271602',
//     type: 'template',
//     template: {
//       name: templateName,
//       language: {
//         code: 'en_US',
//       },
//     },
//   };

//   axios.post(apiEndpoint, postData, {
//     headers: {
//       Authorization: `Bearer ${postmanEnvironment.UserAccessToken}`,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(response => {
//       console.log('Message sent successfully:', response.data);
//     })
//     .catch(error => {
//       console.error('Error sending message:', error.message);
//     });
// }

// var listener = app.listen(process.env.PORT || 3000, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
