//!/bin/nodejs

//Imports
var express = require('express');
var Twitter = require('twitter');
var Client = require('node-rest-client').Client;
var keys = require('./api_keys.json');
var sentiment = require('./sentiment.js');
var path = require('path');
//Initialise packages used as objects
var app = express();
var restClient = new Client();


const FAQAPI_LOCATION = 'http://community.dur.ac.uk/ryan.collins/faq2016/FAQAPI/topics/faqs.php';




var twit = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
});

app.get('/sentiment', function(req,res) {
    //assume text is URL encoded.
    var text = req.query.text;

    //set the search params to list 20 tweets, with the input text
    search_params = {q: text,count: 20};

    //get tweets
    twit.get('search/tweets',search_params, function(error, tweets, response) {
        if(!error) {
            //initially, there is no score.
            var score = 0;
            //go through each tweet, adding the sentiment score for each tweet to our accumulator
            tweets.statuses.forEach(function(element) {
                //get the sentiment score for the individual tweet
                score += sentiment.getSentenceScore(element.text);
            }, this);

            //output the score as JSON
            //TODO: make this slightly nicer JSON output (properly)
            res.send("{'sentiment':" + score + "}");
        }
        else {
            res.send(error);
        }
    });
    

});

app.get('/', function(req,res) {
    
    var params = {}

    //TODO test for no topic
    params['topic'] = req.query.topic;

    params['text'] = req.query.text;
    
    var twitterPromise = Promise.resolve(function(fulfill,reject) {

    });

    var faqReqArgs = {
        path: params
    };

    restClient.get("http://community.dur.ac.uk/ryan.collins/faq2016/FAQAPI/topics/faqs.php?topic=${topic}&text=${text}",faqReqArgs,function(data,response) {
        
        // now we shall process twitter
        search_params = {q: params['text'], count:20};

         twit.get('search/tweets',search_params, function(error, twitterdata, response) {
            var tweets = {
                        positive: [],
                        negative: []
                    };
            if(!error) {

                //initially, there is no score.
                //go through each tweet, adding the sentiment score for each tweet to our accumulator
                twitterdata.statuses.forEach(function(element) {
                    var tweet = {};
                    
                    tweet.text = element.text;
                    tweet.id = element.id;
                    tweet.sentiment = sentiment.getSentenceScore(element.text);
                    if(tweet.sentiment > 0) {
                        tweets.positive.push(tweet);
                    }
                    else {
                        tweets.negative.push(tweet);
                    }
                    
                }, this);
                
                // then go through tweets, finding the three top and three negative ones.
                sentimentSortFunction = function(a,b) {
                    if(a.sentiment < b.sentiment) {
                        return 1;
                    }
                    if(a.sentiment > b.sentiment) {
                        return -1;
                    }
                    return 0;
                }

                // sort in ascending order
                tweets.positive.sort(sentimentSortFunction);
                tweets.negative.sort(sentimentSortFunction);

                // now delete all apart from the last three items.
                // TODO make a function
                console.log(tweets.negative);
                if(tweets.positive.length > 3) {
                    tweets.positive.splice(0,tweets.positive.length - 3);
                }
                if(tweets.negative.length > 3) {
                    console.log(tweets.negative.length - 3);
                    tweets.negative.splice(0,tweets.negative.length - 3);
                }           
                console.log("Leng"); 
                console.log(tweets.negative.length);
                res.send(tweets);   

    }
    else {
        console.log(error);
    }
});

    });
});


   



//set express to host static files (e.g. index.html).
app.use('/', express.static(path.join(__dirname, "static")));


//bind the app to the port
app.listen(8080);

//success - now test!
console.log("listening on port 8080");
