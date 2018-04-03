/*******************************************
* Facebook Purge                             *
* Written with love by Star Dot Hosting Inc. *
* www.shift8web.ca                           *
********************************************/

var casper = require('casper').create({
    verbose: true,
    logLevel: "warning",
    pageSettings: {
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24",
            loadImages:  true,          // load images
            loadPlugins: true,         // do not load NPAPI plugins (Flash, Silverlight, ...)
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
var fs = require('fs');
var xpath = require('casper').selectXPath;
var mouse = require("mouse").create(casper);
var config = require("./config.json");
var username = casper.cli.get("user");
var password = casper.cli.get("pass");
var post_id = casper.cli.get("postid"); // story_fbid=
var user_id = casper.cli.get("userid"); // id=
var thePost = "https://m.facebook.com/story.php?story_fbid=" + post_id + "&id=" + user_id;
var waitTime = 4000;
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

casper.waitForSelector('div[data-sigil="story-popup-causal-init"]', function _waitAfterClick() {
    this.click('div[data-sigil="story-popup-causal-init"] a[data-sigil="touchable"]');
},function(){
    this.echo('failed to click feed edit menu', 'INFO');
});

casper.then(function _waitAfterClick() {
    casper.wait(waitTime, function() {});
});

/*****************************
* Click edit button for post *
*****************************/
casper.waitForSelector('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]');
    casper.wait(waitTime, function() {});
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});

/**********************
* Change post content *
**********************/
casper.waitForSelector('form[data-sigil="m-edit-post-form"]', function _waitAfterClick() {
    this.evaluate(function () { jq = $.noConflict(true) } ); 
    console.log('Trying to edit and submit form : ' + random_post);
    this.mouse.move('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
    this.mouse.click('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
    this.evaluate(function(random_post) {
        $('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]').text(random_post);
    }, random_post);
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});

casper.then(function _waitAfterClick() {
    console.log("Make a screenshot of feed edit box filled in");
    this.capture('AfterLogin5.png');
});
/****************************
* Save changed post content *
*****************************/
casper.then(function _waitAfterClick() {
    this.mouse.move('button[data-sigil="post-edit-save-button"]');
    this.mouse.down('button[data-sigil="post-edit-save-button"]');
    this.mouse.up('button[data-sigil="post-edit-save-button"]');
    this.mouse.click('button[data-sigil="post-edit-save-button"]');
    var js = this.evaluate(function() {
        return document;
    });
    fs.write('results.html', this.getPageContent()); 
})

casper.then(function _waitAfterClick() {
    console.log("Make a screenshot of feed edit save box in");
    this.capture('After_Post_Edit.png');
});

casper.run(function() {
    this.exit();
}); 
