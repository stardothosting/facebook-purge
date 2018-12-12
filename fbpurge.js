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
    var uarticle = new Array("The", "A", " One", "Some", "Any", "This", "That", "An", "Such", "What", "Rather", "Quite");
    var larticle = new Array("the", "a", "one", "some", "any", "this", "that", "an", "such", "what", "rather", "quite");
    var preposition = new Array("to", "from", "over", "under", "on", "of", "with", "at", "into", "including", "unil", "against", "among", "throughout", "despite", "towards", "upon", "concerning");
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

var parseQueryString = function( queryString ) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

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
if (post_id_file) {
    var post_ids = fs.read(post_id_file).split("\n");
}
var user_id = casper.cli.raw.get("userid"); // id=
var action = casper.cli.raw.get("action"); // get the intended action
var waitMinTime = 6000;
var waitMaxTime = 10000;
var minWait = 9000;
var maxWait = 12000;
var wallUrl = config['urls']['loginUrl'] + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.
var waitTime = Math.floor(Math.random() * waitMaxTime) + waitMinTime;

/***************************************
* Login and authenticate with facebook *
***************************************/
//casper.start().thenOpen(config['urls']['loginUrl'], function() {
casper.start().thenOpen('https://m.facebook.com/login/?ref=dbl&fl', function() {
    console.log(username);
    console.log("Facebook website opened");
});

casper.then(function(){
    this.evaluate(function(username, password){
        document.getElementById("m_login_email").value = username;
        document.getElementById("m_login_password").value = password;
        document.querySelectorAll('button[data-sigil="touchable m_login_button"]')[0].click();
    },{
        username : username,
        password : password
    });
});

casper.then(function(){
    this.waitForSelector('div[data-sigil="context-layer-root content-pane"]', function pass () {
        console.log("Logged In Successfully");
        this.capture('AfterLogin.png');
    }, function fail () {
        console.log("did not Log In");
        this.capture('login.png');
    //}, waitTime); // timeout limit in milliseconds
    });
});

// Load include dependent on action argument
casper.then(function() {
    if (action == 'postgrab') {
        phantom.injectJs('./includes/fb_postgrab.js');
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
