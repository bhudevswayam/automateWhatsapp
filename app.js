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
                          name: 'hello_world',
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
