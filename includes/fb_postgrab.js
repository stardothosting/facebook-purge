var activity_log = "https://m.facebook.com/" + user_id + "/allactivity?log_filter=cluster_11&ref=bookmarks";
var forEach = require('async-foreach').forEach;

casper.thenOpen(activity_log, function _waitAfterStart() {
    casper.wait(waitTime, function() {});
});

casper.then(function _waitAfterClick() {
    //casper.wait(waitTime, function() {});
    this.capture('after_activityload.png');
});

casper.then(function _waitAfterClick() {
	casper.scrollToBottom();
	//casper.wait(waitTime, function() {});
	this.capture('after_scrollbottom.png');
})

// Click all parent timeline months/years
casper.waitForSelector('div[data-sigil="timeline-section"]', function() {
        var elements = casper.getElementsInfo('div[data-sigil="timeline-section"]');
        var current = 0;
        var end = elements.length;
        //casper.echo("Data store : " + JSON.stringify(dataStore, null, 2));
        //casper.echo("Data store specific : " + dataStore[0].attributes["data-store"]);
	        for (;current < end;) {
	        	(function(elements,current,end) {
	        		var quickWait = Math.floor(Math.random() * maxWait) + minWait;
	        		//casper.wait(quickWait, function() {});
	        		//casper.scrollToBottom();
	        		var selector_id = '#' + elements[current].attributes["id"];
	        		var selector = selector_id + ' div[data-store]';
	        		if (!casper.exists(selector_id + ' div[data-sigil="timeline-label hidden-content marea"]')) {
		        		casper.waitForSelector(selector, function() {
		        			this.mouse.move(selector);
				            this.mouse.down(selector);
				            this.mouse.up(selector);
				            this.mouse.click(selector);
				            casper.echo('clicked');
							casper.wait(quickWait, function() {});
							this.capture('after_postclick_' + current + '.png');
						});
						//current = 0;
						//continue;
		        	}
	        		casper.then(function _waitAfterClick() {
	        			if (casper.exists(selector_id + ' div[data-sigil="timeline-label hidden-content marea"]')) {
			        		var no_stories = casper.getElementInfo(selector_id + ' div[data-sigil="timeline-label hidden-content marea"]').text;
			        		casper.echo('No stories : ' + no_stories);
			        		casper.echo("Selector : " + selector);
			        		if (no_stories != 'No stories available') {
							        // Only if theres content for this month/year selector
							        if (casper.exists(selector_id + ' div[data-sigil="unit-container hidden-content"] a')) {
							        	casper.echo('Selector ' + selector_id + ' exists!');
							        	var hidden_elements = casper.getElementsInfo(selector_id + ' div[data-sigil="unit-container hidden-content"] a');
								        casper.echo('Hidden elements : ' + JSON.stringify(hidden_elements));
							            /*casper.waitForSelector(selector_id + ' div[data-sigil="unit-container hidden-content"] a', function() {
							        		var dataStore = casper.getElementsInfo(selector_id + ' div[data-sigil="unit-container hidden-content"] a');
											casper.echo("Story ID : " +  dataStore[0].attributes["href"]);
											var dataHref = dataStore[0].attributes["href"];
											var fbID = parseQueryString(dataHref);
											casper.echo("Facebook ID : " + JSON.stringify(fbID["/story.php?story_fbid"]));
										});
										*/
									} else {
										casper.echo('Selector ' + selector_id + ' doesnt exist!');
									}
							} else {
								casper.echo('No stories!');
							}
						} else {
							casper.echo('Selector for hidden area doesnt exist');
						}
					});
	        		

		        })(elements,current,end);
	        	current++;
	        }
},function(){
    this.echo('failed to get feed IDs', 'INFO');
});



casper.then(function _waitAfterClick() {
    //casper.wait(30000, function() {});
    this.capture('after_postgrab.png');
});