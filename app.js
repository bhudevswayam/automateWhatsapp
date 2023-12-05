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