// Sentiment.js
// Written by Ryan Collins 2016
// Use this to return a score based on the words.json score object
var word_score = require('./words.json');

//define our function
var getSentenceScore = function(sentence) {
    var score = 0;
    var components = sentence.toLowerCase().split(' ');
    components.forEach(function(word) {
        if(word in word_score) {
            score += word_score[word];
        }
    });
    return score;
}

//export it so that node can see the function
module.exports.getSentenceScore = getSentenceScore;