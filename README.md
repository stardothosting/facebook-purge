# Facebook Purge (Proof of concept)
## By Shift8 Web
### [Toronto Web Design and Development](https://www.shift8web.ca)

Note : This script is proof of concept. Use at your own risk. It is also a work in progress so contributions are very welcome.

#### Overview 

Facebook purge is a python script that utilizes the beautiful soup module to interact with a specific facebook post ID. The goal is a proof of concept to interact with your own facebook data in order to edit the data within the post.

If one were to choose to obfuscate that data over a period of time to allow the "poisoned" data to propagate throughout Facebook's infrastructure (replicated data centres, backups, etc) before permanently deleting the post, this script would be one way to accomplish such a feat. 

This is a work in progress, contributions are more than welcome. 

#### Why not just deactivate and delete your account?

Unless you are lucky enough to live in a place that has strict data privacy laws (such as the European Union), your data is never truly gone. Its safe to assume that, unless facebook is legally obligated through a court order, they will never ever delete your data. Your data will always be associated with you through many different metrics of linking all that you have posted, liked, commented and tagged for as long as facebook is able to maintain the infrastructure to store the data (i.e. forever).

With my background as a systems administrator and full stack developer, I can only imagine all the geographically redundant and multi-layered offsite data backup and data shipping that happens behind the scenes at facebook. They have more than enough resources to tie your data up on many servers across many data centres around the globe. All transparent to you. You will never truly know that your data is without a doubt deleted.

#### Why obfuscate and poison the data? Why not just delete the posts?

This script can never be guaranteed to be 100% effective. What it can do is obfuscate and poison the data metrics that are being sold by Facebook to 3rd party companies around the world (such as Cambridge Analytica). Ultimately the script will edit and revise each individual post as many times as you feel necessary before deleting. The key is to implement this script over time, to edit and revise your content with random or "poisoned" (useless) data over the course of 30, 60, 90 or more days. All the backup and replication that happens behind the scenes will absorb this obfuscated data.

When you are satisfied, then you can delete the post.

#### How do you 
