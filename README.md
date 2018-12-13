# Facebook Purge (Proof of concept)
#### By Shift8 Web
#### [Toronto Web Design and Development](https://www.shift8web.ca)

Note : This script is proof of concept. Use at your own risk. It is also a work in progress so contributions are very welcome.

## Overview 

Facebook purge is a javascript (CasperJS) solution that utilizes the beautiful soup module to interact with a specific facebook post ID. The goal is a proof of concept to interact with your own facebook data in order to edit the data within the post.

If one were to choose to obfuscate that data over a period of time to allow the "poisoned" data to propagate throughout Facebook's infrastructure (replicated data centres, backups, etc) before permanently deleting the post, this script would be one way to accomplish such a feat. 

This is a work in progress, contributions are more than welcome. 

## Why not just deactivate and delete your account?

Unless you are lucky enough to live in a place that has strict data privacy laws (such as the European Union), your data is never truly gone. Its safe to assume that, unless facebook is legally obligated through a court order, they will never ever delete your data. Your data will always be associated with you through many different metrics of linking all that you have posted, liked, commented and tagged for as long as facebook is able to maintain the infrastructure to store the data (i.e. forever).

With my background as a systems administrator and full stack developer, I can only imagine all the geographically redundant and multi-layered offsite data backup and data shipping that happens behind the scenes at facebook. They have more than enough resources to tie your data up on many servers across many data centres around the globe. All transparent to you. You will never truly know that your data is without a doubt deleted.

## Why obfuscate and poison the data? Why not just delete the posts?

This script can never be guaranteed to be 100% effective. What it can do is obfuscate and poison the data metrics that are being sold by Facebook to 3rd party companies around the world (such as Cambridge Analytica). Ultimately the script will edit and revise each individual post as many times as you feel necessary before deleting. The key is to implement this script over time, to edit and revise your content with random or "poisoned" (useless) data over the course of 30, 60, 90 or more days. All the backup and replication that happens behind the scenes will absorb this obfuscated data.

When you are satisfied, then you can delete the post.

## Requirements for the script

You need to install [CasperJS](http://casperjs.org/). You can follow the instructions on their site, or you can run the following (assuming you have node installed) :

```
npm install phantomjs
npm install casperjs
npm install async-foreach
node_modules/casperjs/bin/casperjs selftest
```

## How do you use the script

Right now the script will edit one "post", designated by a post id argument passed to the script. The script takes 4 arguments :

### user 

This is your username used when logging into facebook. Typically it would be your email address

### pass

This would be the password to login to facebook.

### postid

This is the "story_fbid" URL parameter passed when viewing a story. If you view a single post on facebook and look at the url bar, it should look something like this :

`https://www.facebook.com/story.php?story_fbid=9999&id=8888`

In the above example, the postid would be "9999"

### userid

This can be grabbed in a more intelligent version of the script , but currently it needs to be passed as an argument. In the same URL example above, the userid field would be "8888".

So a full example of the script would look like :

`casperjs fbpurge.js --user="you@whatever.com" --pass='password' --postid='9999' --userid='8888' --postid_file='/Users/johnsmith/fb/ids.txt'`

### Post IDs

Currently the script can accept a list of facebook post IDs as a text file list. One ID per line, plain text. Simply pass the following argument to the script :

`--postid_file='/Users/johnsmith/fb/ids.txt'`

## How does the script work

Using CasperJS, we are logging into your facebook account. Once logged in we move to the post ID provided and click the edit link, fill in some randomly generated text, and hit save. Just like you would in a browser. The randomly generated text is a placeholder for now to generate more realistic "spun" text that doesn't seem so fake (and potentially could be detected as malicious or suspicious activity).
