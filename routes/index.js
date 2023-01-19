// Requires
let express = require('express');
const axios = require('axios');
let router = express.Router();
const { ParsePhotoRsp, createFlickrOptions } = require('./flickr.js');


/////////////counter//////////////////
//AWS config
var AWS = require("aws-sdk");

let awsConfig = {
    region: "YOURREGION",
    endpoint: "DynamodbURL",
    accessKeyId: "YOURID",
    secretAccessKey: "YOURKEY",
    sessionToken: "YOURTOKEN"
    // "accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    // "sessionToken": process.env.AWS_SESSION_TOKEN
};

AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let dynamoCounter = function () {
    var params = {
        TableName: "TABLENAME",
        Key: {
            "username": "YOURNAME",
            "my-basic-key": "YOURKEY",
        },
    };
    docClient.get(params, function (error, data) {
        if (error) {
            console.log(
                "users::dynamoCounter::error - " + JSON.stringify(error, null, 2)
            );
        } else {
            console.log(
                "users::dynamoCounter::success - " + JSON.stringify(data, null, 2)
            );
            let temp = data;
            num = temp["Item"]["counter"];
            console.log("num", num);
            modify(num);
        }
    });
};

let modify = function (num) {
    counter = num + 1;
    var params = {
        TableName: "TABLENAME",
        Key: {
            "username": "YOURNAME",
            "my-basic-key": "YOURKEY",
        },
        UpdateExpression: "SET #counter = :val",
        ExpressionAttributeValues: {
            ":val": num + 1,
        },
        ExpressionAttributeNames: {
            "#counter": "counter",
        },
        ReturnValues: "UPDATED_NEW",
    };
    docClient.update(params, function (error, data) {
        if (error) {
            console.log(
                "users::update::error - " + JSON.stringify(error, null, 2));
        } else {
            console.log(
                "users::update::success - " + JSON.stringify(data));
        }
    });
    console.log("counter: ", num)
};



///////////////////////////////////Retrieve photo info
const GoogleAPI = 'YOURAPI';

let num;
router.get('/', (req, res, next) => {
    dynamoCounter();

    var tags = req.query.tags == undefined ? '' : req.query.tags;
    let username = req.query.username == undefined ? '' : req.query.username;
    let lat = req.query.lat == undefined ? '' : req.query.lat;
    let lng = req.query.lng == undefined ? '' : req.query.lng;

    //Determin Flickr API URL
    const options = createFlickrOptions(tags, username, lat, lng);
    var url = `https://${options.hostname}${options.path}`;

    if (tags == '' && username == '') {
        url = '';
    }

    //Query photo info from Flickr API
    axios.get(url)
        .then((response) => {
            return response.data;
        })
        .then((rsp) => {
            if (typeof rsp.photos !== 'undefined') {
                var photos = ParsePhotoRsp(rsp.photos.photo);
                //Render index page
                res.render("index", {
                    num,
                    url: url,
                    tags: tags,
                    photos: photos,
                    lat: lat,
                    lng: lng,
                    google: {
                        maps: {
                            apikey: GoogleAPI
                        }
                    }
                });
            } else {
                res.render("index", {
                    num,
                    url: 0,
                    tags: 0,
                    photos: 0,
                    lat: 0,
                    lng: 0,
                    google: {
                        maps: {
                            apikey: GoogleAPI
                        }
                    }
                });
            }
        })
        //detect error
        .catch((error) => {
            if (error instanceof TypeError) {
                res.render("index", {
                    num,
                    url: 0,
                    tags: 0,
                    photos: 0,
                    lat: 0,
                    lng: 0,
                    google: {
                        maps: {
                            apikey: GoogleAPI
                        }
                    }
                });
            } else {
                res.render("index", {
                    num,
                    url: 0,
                    tags: 0,
                    photos: 0,
                    lat: 0,
                    lng: 0,
                    google: {
                        maps: {
                            apikey: GoogleAPI
                        }
                    }
                });
            }
        })
});


module.exports = router;