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
            //userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1",
            loadImages:  true,          // load images
            loadPlugins: true,         // load NPAPI plugins (Flash, Silverlight, ...)
            webSecurityEnabled: false   // allows for flexible ajax 
    },
    clientScripts: ['jquery-3.3.1.min.js']

});


/************
* Functions *
************/

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
var utils = require("utils");
var fs = require('fs');
var xpath = require('casper').selectXPath;
var mouse = require("mouse").create(casper);
var config = require("./config.json");
var username = casper.cli.get("user");
var password = casper.cli.get("pass");
var post_id = casper.cli.raw.get("postid"); // story_fbid=
var post_id_file = casper.cli.raw.get("postid_file");
var post_ids = fs.read(post_id_file).split("\n");
var user_id = casper.cli.raw.get("userid"); // id=
var waitMinTime = 6000;
var waitMaxTime = 10000;
var minWait = 2000;
var maxWait = 5000;
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


/* Wrapper for editing all posts */
var forEach = require('async-foreach').forEach;
post_ids.forEach(function(single_id, index) {
    // Set random wait times to multiple variables to appear more organic
    var quickWait_1 = Math.floor(Math.random() * maxWait) + minWait;
    var quickWait_2 = Math.floor(Math.random() * maxWait) + minWait;
    var quickWait_3 = Math.floor(Math.random() * maxWait) + minWait;
    var quickWait_4 = Math.floor(Math.random() * maxWait) + minWait;
    var waitTime = Math.floor(Math.random() * waitMaxTime) + waitMinTime;

    // Set post url and random post message
    var thePost = "https://m.facebook.com/" + user_id + "/posts/" + single_id ;
    var random_post = randomSentence();

    /**************************
    * Go to the facebook post *
    **************************/
    casper.thenOpen(thePost, function _waitAfterStart() {
        casper.wait(quickWait_1, function() {});
    });

    casper.waitForSelector('div[data-sigil="story-popup-causal-init"]', function _waitAfterClick() {
        this.click('div[data-sigil="story-popup-causal-init"] a[data-sigil="touchable"]');
    },function(){
        this.echo('failed to click feed edit menu', 'INFO');
        //this.capture('edit1.png');
    });

    casper.then(function _waitAfterClick() {
        casper.wait(quickWait_2, function() {});
    });

    /*****************************
    * Click edit button for post *
    *****************************/
    casper.waitForSelector('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]', function _waitAfterClick() {
        //this.evaluate(function () { jq = $.noConflict(true) } ); 
        this.click('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]');
        casper.wait(quickWait_3, function() {});
    },function(){
        this.echo('failed to click feed edit link1', 'INFO');
        //this.capture('edit2.png');
    });

    /**********************
    * Change post content *
    **********************/
    casper.waitForSelector('form[data-sigil="m-edit-post-form"]', function _waitAfterClick() {
        this.evaluate(function () { jq = $.noConflict(true) } ); 
        console.log('Trying to edit and submit form : ' + random_post + ' FBID : ' + single_id + ' random wait time : ' + quickWait);
        this.mouse.move('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
        this.mouse.click('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
        this.evaluate(function(random_post) {
            $('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]').text(random_post);
        }, random_post);
        casper.sendKeys('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]', random_post, { reset: true } );
        casper.wait(quickWait_4, function() {});
    },function(){
        this.echo('failed to click feed edit link2', 'INFO');
    });

    casper.then(function _waitAfterClick() {
        console.log("Edit box filled in..");
        //this.capture('edit_screen.png');
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
        console.log("Edit box saved..");
        casper.wait(waitTime, function() {});
        //this.capture('After_Post_Edit.png');
    });
});
// end of foreach

casper.run(function() {
    this.exit();
}); 
