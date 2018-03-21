var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    loadImages: false,
    loadPlugins: false,
    pageSettings: {
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24"
    }
});

// Get user arguments
var utils = require("utils");
var config = require("./config.json");
var username = casper.cli.get("user");
var password = casper.cli.get("pass");
//var poid = casper.cli.get("postid");

var wallUrl = config['urls']['loginUrl'] + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.
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
        //this.capture('AfterLogin.png');
    }, function fail () {
        console.log("did not Log In");
        //this.capture('login.png');
    }, 10000); // timeout limit in milliseconds
});

//go to the facebook post
var thePost = "https://www.facebook.com/story.php?story_fbid=47455157912&id=1429340672";
casper.thenOpen(thePost, function() {
    this.evaluate(function() {
        console.log("At the right post");
        document.querySelectorAll('#u_0_x')[0].click();
    });
});
 
//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function(){
    console.log("Make a screenshot and save it as AfterLogin.png");
	this.wait(6000);//Wait a bit so page loads (there are a lot of ajax calls and that is why we are waiting 6 seconds)
    this.capture('AfterLogin2.png');
});


casper.run(function() {
    this.exit();
}); 
