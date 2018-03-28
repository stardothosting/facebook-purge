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
var waitTime = 3000;
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

// Desktop
casper.waitForSelector('div[data-sigil="story-popup-causal-init"]', function _waitAfterClick() {
    this.click('div[data-sigil="story-popup-causal-init"] a[data-sigil="touchable"]');
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
casper.waitForSelector('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    this.click('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]');
    casper.wait(waitTime, function() {});
},function(){
    this.echo('failed to click feed edit link', 'INFO');
});

casper.then(function _waitAfterClick() {
    console.log("Make a screenshot of feed edit screen");
    casper.wait(waitTime, function() {});
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
casper.waitForSelector('form[data-sigil="m-edit-post-form"]', function _waitAfterClick() {
    //this.evaluate(function () { jq = $.noConflict(true) } ); 
    //this.click('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
    //document.queryselectorAll('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]').value = random_post;
    console.log('Trying to edit and submit form ...');
    this.mouse.move('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
    this.sendKeys('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]', random_post);
    //this.click('button.btn.btnI.bgb.mfss.touchable');
    /*this.evaluate(function(random_post) {
        $('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]').text(random_post);
        document.queryselectorAll('form[data-sigil="m-edit-post-form"]').submit();
        var js = this.evaluate(function() {
            return document;
        });
        fs.write('results.html', this.getPageContent()); 

    }, random_post)

    this.thenEvaluate(function() {
        document.querySelector('form[data-sigil="m-edit-post-form"]').submit();
    });*/

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
casper.then(function() {

    //this.click('button.btn.btnI.bgb.mfss.touchable');
    //this.mouse.move('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
    //this.mouse.move('button.btn.btnI.bgb.mfss.touchable');
    //this.mouse.down('button.btn.btnI.bgb.mfss.touchable');
    //this.mouse.up('button.btn.btnI.bgb.mfss.touchable');
    //this.mouse.click('button.btn.btnI.bgb.mfss.touchable');
    this.mouse.move("#u_6_3");
    this.mouse.down("#u_6_3");
    this.mouse.up("#u_6_3");
    this.mouse.click("#u_6_3");
    //this.click('#u_6_3');
    /*this.evaluate(function(){
    document.getElementById("u_6_3").click();
    });*/

    var js = this.evaluate(function() {
        return document;
    });
    //this.echo(js.all[0].outerHTML);
    fs.write('results.json', this.getPageContent()); 
    fs.write('test.html', js.all[0].outerHTML);
})

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


/*casper.then(function() {

    //this.click(xpath('//*[contains(text(),"Save")]'));
    this.clickLabel('Save');

//    this.page.sendEvent("keydown", this.page.event.key.Control);
//    this.page.sendEvent("keydown", this.page.event.key.Enter);


},function(){
    this.echo('failed to click feed edit link', 'INFO');
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
});*/
    
casper.run(function() {
    this.exit();
}); 
