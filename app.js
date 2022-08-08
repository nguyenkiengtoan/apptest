const express = require('express');
const https = require('https');
const request = require('request');
const bodyparser = require('body-parser');
const port = process.env.PORT;

const app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));


app.get('/', (req,res) => {{
    res.sendFile(__dirname + '/signup.html');
}});

app.post('/', (req,res) => {
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/3e12618443";
    const options = {
        method: "post",
        auth: "toannguyen:5a00e1ee0a05e2b0b43d2f6f44ccd34b-us14"
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname+'/success.html');
        } else {
            res.sendFile(__dirname+'/failure.html');
        };

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post('/failure', (req,res) => {
    res.redirect('/');
} );


app.listen(port || 3000, ()=>{{
    console.log(`listen from port ${port}`)
}});

// 5a00e1ee0a05e2b0b43d2f6f44ccd34b-us14

// 3e12618443

// us14