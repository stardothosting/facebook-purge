var casper = require('casper').create({
    verbose: true,
    logLevel: "error",

    pageSettings: {
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24",
            loadImages:  true,          // do not load images
            loadPlugins: false,         // do not load NPAPI plugins (Flash, Silverlight, ...)
            webSecurityEnabled: false // ajax 
    },
});

// Get user arguments
var utils = require("utils");
var config = require("./config.json");
var username = casper.cli.get("user");
var password = casper.cli.get("pass");
var waitTime = 2000;
var thePost = "https://www.facebook.com/story.php?story_fbid=47455157912&id=1429340672";
var wallUrl = config['urls']['loginUrl'] + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.

// Facebook Authenticate
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
    }, 10000); // timeout limit in milliseconds
});

//go to the facebook post
casper.thenOpen(thePost, function _waitAfterStart() {
    casper.wait(waitTime, function() {});
});

casper.waitForSelector('a[data-testid="post_chevron_button"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('a[data-testid="post_chevron_button"]');
},function(){
    this.echo('failed to click feed edit menu', 'INFO');
});

casper.then(function _waitAfterClick() {
    casper.wait(waitTime, function() {});
});

//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function(){
    console.log("Make a screenshot of feed edit menu");
    casper.wait(waitTime, function() {});
    this.capture('AfterLogin2.png');
});

casper.waitForSelector('a[data-feed-option-name="FeedEditOption"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('a[data-feed-option-name="FeedEditOption"]');
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});

casper.then(function _waitAfterClick() {
    casper.wait(waitTime, function() {});
});

//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function(){
    console.log("Make a screenshot of feed edit screen");
	casper.wait(waitTime, function() {});
    this.capture('AfterLogin3.png');
});

casper.run(function() {
    this.exit();
}); 
