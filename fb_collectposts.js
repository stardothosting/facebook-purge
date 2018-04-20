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
            loadPlugins: true,         // load NPAPI plugins (Flash, Silverlight, ...)
            webSecurityEnabled: false   // allows for flexible ajax 
    },
    clientScripts: ['jquery-3.3.1.min.js']

});

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
var user_id = casper.cli.get("userid"); // id=
var theActivity = "https://m.facebook.com/" + user_id + "/allactivity?ref=bookmarks";
var waitTime = 4000;
var waitShortTime = 1000;
var wallUrl = config['urls']['loginUrl'] + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.

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
casper.thenOpen(theActivity, function _waitAfterStart() {
    casper.wait(waitTime, function() {});
});

// Click all parent timeline months/years
casper.waitForSelector('div[data-sigil="timeline-section"]', function() {
        var elements = casper.getElementsInfo('div[data-sigil="timeline-section"]');
        elements.forEach(function(element){
            if (element.attributes["data-sigil"] === "timeline-section") {
                casper.echo("data attribute and content are exactly equal: " + JSON.stringify(element.attributes["id"]));
                var button_id = "#" + element.attributes["id"];
                casper.echo("element : " + button_id);
                //this.click(element.attributes["data-sigil"]);
                this.mouse.move(button_id + ' div[data-sigil="section-loader section-loader-button"]');
                this.mouse.down(button_id + ' div[data-sigil="section-loader section-loader-button"]');
                this.mouse.up(button_id + ' div[data-sigil="section-loader section-loader-button"]');
                this.mouse.click(button_id + ' div[data-sigil="section-loader section-loader-button"]');
                //this.click(button_id + ' div[data-sigil="section-loader section-loader-button"]');
                casper.wait(waitTime, function() {});
            } else {
                casper.echo("data attribute and content are different: " + JSON.stringify(element.attributes));
            }
        });
    //this.click('div[data-sigil="story-popup-causal-init"] a[data-sigil="touchable"]');
},function(){
    this.echo('failed to click feed edit menu', 'INFO');
});

casper.then(function _waitAfterClick() {
    casper.wait(waitTime, function() {});
    this.capture('AfterLogin1.png');
});

/*****************************
* Click edit button for post *
*****************************/
/*casper.waitForSelector('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]');
    casper.wait(waitTime, function() {});
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});*/

/**********************
* Change post content *
**********************/
/*casper.waitForSelector('form[data-sigil="m-edit-post-form"]', function _waitAfterClick() {
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
});*/
/****************************
* Save changed post content *
*****************************/
/*casper.then(function _waitAfterClick() {
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
});*/

casper.run(function() {
    this.exit();
}); 
