/*******************************************
* Facebook Purge                             *
* Written with love by Star Dot Hosting Inc. *
* www.shift8web.ca                           *
********************************************/
var utils = require("utils");
var fs = require('fs');

var casper = require('casper').create({
    verbose: true,
    logLevel: "warning",
    pageSettings: {
            //userAgent: randomUserAgent(),
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24",
            loadImages:  true,          // load images
            loadPlugins: true,         // load NPAPI plugins (Flash, Silverlight, ...)
            webSecurityEnabled: false   // allows for flexible ajax 
    },
    clientScripts: ['jquery-3.3.1.min.js']

});

/************
* Functions *
************/

// Used to pick a random user agent every time
function randomUserAgent() {
    var userAgents = fs.read('user_agents.txt').split("\n");
    var userAgent_r = Math.floor(Math.random() * userAgents.length);
    return userAgents[userAgent_r];
}

function randomSentence() {
    var uarticle = new Array("The", "A", " One", "Some", "Any");
    var larticle = new Array("the", "a", "one", "some", "any");
    var preposition = new Array("to", "from", "over", "under", "on");
    var noun = fs.read('nouns.txt').split("\n");
    var verb = fs.read('verbs.txt').split("\n");
    var uarticle_r = Math.floor(Math.random() * uarticle.length);
    var noun_r1 = Math.floor(Math.random() * noun.length);
    var noun_r2 = Math.floor(Math.random() * noun.length);
    var verb_r = Math.floor(Math.random() * verb.length);
    var larticle_r = Math.floor(Math.random() * larticle.length);
    var preposition_r = Math.floor(Math.random() * preposition.length);
    return uarticle[uarticle_r] + " " + noun[noun_r1] + " " + verb[verb_r] + " " + preposition[preposition_r] + " " + larticle[larticle_r] + " " + noun[noun_r2] + ".";   
}

/***************************************
* Declare variables and user arguments *
***************************************/
var xpath = require('casper').selectXPath;
var mouse = require("mouse").create(casper);
var config = require("./config.json");
var username = casper.cli.get("user");
var password = casper.cli.get("pass");
var post_id = casper.cli.raw.get("postid"); // story_fbid=
var post_id_file = casper.cli.raw.get("postid_file");
var post_ids = fs.read(post_id_file).split("\n");
var user_id = casper.cli.raw.get("userid"); // id=
var action = casper.cli.raw.get("action"); // get the intended action
var waitMinTime = 6000;
var waitMaxTime = 10000;
var minWait = 2000;
var maxWait = 5000;
var wallUrl = config['urls']['loginUrl'] + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.

var waitTime = Math.floor(Math.random() * waitMaxTime) + waitMinTime;

/***************************************
* Login and authenticate with facebook *
***************************************/
casper.start().thenOpen(config['urls']['loginUrl'], function() {
    console.log(username);
    console.log("Facebook website opened");
});

casper.then(function(){
    this.evaluate(function(username, password){
        document.getElementById("email").value = username;
        document.getElementById("pass").value = password;
        document.querySelectorAll('input[type="submit"]')[0].click();
    },{
        username : username,
        password : password
    });
});

casper.then(function(){
    this.waitForSelector("#pagelet_composer", function pass () {
        console.log("Logged In Successfully");
        this.capture('AfterLogin.png');
    }, function fail () {
        console.log("did not Log In");
        this.capture('login.png');
    }, 20000); // timeout limit in milliseconds
});

// If we are wiping posts'
casper.then(function() {
    if (action == 'postgrab') {
        console.log('Grab post IDs');
    } else if (action == 'commentgrab') {
        console.log('Grab comment IDs');
    } else if (action == 'taggrab') {
        console.log('Grab tag IDs');
    } else if (action == 'postwipe') {
        phantom.injectJs('./includes/fb_postwipe.js');
    } else if (action == 'commentwipe') {
        console.log('Wipe comments from IDs');
    } else if (action == 'tagwipe') {
        console.log('Wipe tags from IDs');
    } else {
        console.log('No proper action provided.');
    }
});
casper.run(function() {
    this.exit();
}); 
