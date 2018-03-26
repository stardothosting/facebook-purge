/*******************************************
* Facebook Purge                             *
* Written with love by Star Dot Hosting Inc. *
* www.shift8web.ca                           *
********************************************/

var casper = require('casper').create({
    verbose: true,
    logLevel: "error",
    pageSettings: {
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24",
            loadImages:  true,          // load images
            loadPlugins: false,         // do not load NPAPI plugins (Flash, Silverlight, ...)
            webSecurityEnabled: false   // allows for flexible ajax 
    },
    clientScripts: ['jquery-3.3.1.min.js']

});

/************
* Functions *
************/
function randomWord(){
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    var consts =  ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'qu', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'tt', 'ch', 'sh'];
    var len = 8;
    var word = '';
    var is_vowel = false;
    var arr;

    for (var i = 0; i < len; i++) {
      if (is_vowel) arr = vowels
      else arr = consts
      is_vowel = !is_vowel;
      word += arr[Math.round(Math.random()*(arr.length-1))];
    }
    return word;
}

/***************************************
* Declare variables and user arguments *
***************************************/
var utils = require("utils");
var mouse = require("mouse").create(casper);
var config = require("./config.json");
var username = casper.cli.get("user");
var password = casper.cli.get("pass");
var post_id = casper.cli.get("postid"); // story_fbid=
var user_id = casper.cli.get("userid"); // id=
var thePost = "https://www.facebook.com/story.php?story_fbid=" + post_id + "&id=" + user_id;
var waitTime = 2000;
var wallUrl = config['urls']['loginUrl'] + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.



var random_post = randomWord() + ' ' + randomWord() + ' ' + randomWord() + ' ' + randomWord();

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
    }, 10000); // timeout limit in milliseconds
});

/**************************
* Go to the facebook post *
**************************/
casper.thenOpen(thePost, function _waitAfterStart() {
    casper.wait(waitTime, function() {});
});

casper.waitForSelector('a[data-testid="post_chevron_button"]', function _waitAfterClick() {
    this.click('a[data-testid="post_chevron_button"]');
},function(){
    this.echo('failed to click feed edit menu', 'INFO');
});

casper.then(function _waitAfterClick() {
    casper.wait(waitTime, function() {});
});

//Take a screenshot
casper.then(function(){
    console.log("Make a screenshot of feed edit menu");
    casper.wait(waitTime, function() {});
    this.capture('AfterLogin2.png');
});

/*****************************
* Click edit button for post *
*****************************/
casper.waitForSelector('a[data-feed-option-name="FeedEditOption"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('a[data-feed-option-name="FeedEditOption"]');
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});

casper.then(function _waitAfterClick() {
    console.log("Make a screenshot of feed edit screen");
    this.capture('AfterLogin3.png');
});

//Take a screenshot
casper.then(function(){
    console.log("Make a screenshot of feed edit screen");
	casper.wait(waitTime, function() {});
    this.capture('AfterLogin4.png');
});


/**********************
* Change post content *
**********************/
casper.waitForSelector('div[data-testid="status-attachment-mentions-input"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('div[data-block="true"]');
    this.evaluate(function(random_post) {
        $('span[data-text="true"]').text(random_post);
    }, random_post)
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});

casper.then(function _waitAfterClick() {
    console.log("Make a screenshot of feed edit box filled in");
    this.capture('AfterLogin5.png');
});

//Take a screenshot
casper.then(function(){
    console.log("Make a screenshot of feed edit box filled in again");
    casper.wait(waitTime, function() {});
    this.capture('AfterLogin6.png');
});

/****************************
* Save changed post content *
*****************************/
casper.waitForSelector('button[data-testid="react-composer-post-button"]', function() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    console.log("About to click save..");
    this.mouse.click('button[data-testid="react-composer-post-button"]');
    this.mouse.click('button');
    this.evaluate(function() {
        var e = $.Event('keypress');
        e.which = 13;
        e.keyCode = 13;
        $('span[data-text="true"]').trigger(e);
        console.log("Done..");
    },)
},function(){
    this.echo('failed to click save for feed edit', 'INFO');
});

casper.then(function _waitAfterClick() {
    console.log("Make a screenshot of feed edit save box in");
    this.capture('AfterLogin7.png');
});

//Take a screenshot
casper.then(function(){
    console.log("Make a screenshot of feed edit save box again");
    casper.wait(waitTime, function() {});
    this.capture('AfterLogin8.png');
});
    
casper.run(function() {
    this.exit();
}); 
