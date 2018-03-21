#!/usr/bin/python

import cookielib
import urllib2
import urllib
import mechanize
import sys,os,pprint,base64,socket,datetime
from bs4 import BeautifulSoup

###########################
# Check command arguments #
###########################
if len(sys.argv) != 2 :
        print "\nUsage Syntax :"
        print "\nfbpurge.py <username> <password> <postid>"
        sys.exit(0)

br = mechanize.Browser()
cookiejar = cookielib.LWPCookieJar()
br.set_cookiejar( cookiejar )
br.set_handle_equiv( True )
#br.set_handle_gzip( True )
br.set_handle_redirect( True ) 
br.set_handle_referer( True )
br.set_handle_robots( False )

br.set_handle_refresh( mechanize._http.HTTPRefreshProcessor(), max_time = 1)
br.addheaders = [ ( 'User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1' ) ]

# Declare Variables
user = sys.argv[0]
passwd = sys.argv[1] 
post_id = sys.argv[2]
url = "https://m.facebook.com/login.php"

#Open URL and submit
br.open(url)
br.select_form(nr=0)
br.form['email'] = user
br.form['pass'] = passwd
br.submit()

#response = br.open("https://www.facebook.com/")
response = br.open("https://www.facebook.com//posts/" + post_id)

bs = BeautifulSoup(response, "lxml")

#for editLink in bs.find_all('a', attrs={'data-feed-option-name' : 'FeedEditOption'}):
for editLink in bs.find_all('a', attrs={'ajaxify' : True}):
	print (editLink.attrs["ajaxify"])
post_params = {'fb_dtsg' : 'AQGNMpyseZfO%3AAQF6rRLQhvVZ',
	'edited_post_fbid' : '1136908109435',
	'story_dom_id' : 'u_0_m',
	'parent_story_dom_id' : 'u_0_m',
	'hey_kid_im_a_composer' : '1',
	'display_context' : 'home',
	'xhpc_context' : 'home',
	'is_permalink' : '1',
	'entstory_context' : '%7B%22is_viewer_page_admin%22%3Afalse%2C%22is_notification_preview%22%3Afalse%2C%22autoplay_with_channelview_or_snowlift%22%3Afalse%2C%22video_player_origin%22%3A%22permalink%22%2C%22fbfeed_context%22%3Atrue%2C%22location_type%22%3A5%2C%22outer_object_element_id%22%3A%22u_0_m%22%2C%22object_element_id%22%3A%22u_0_m%22%2C%22is_ad_preview%22%3Afalse%2C%22is_editable%22%3Afalse%2C%22mall_how_many_post_comments%22%3A2%2C%22story_width%22%3A502%2C%22shimparams%22%3A%7B%22page_type%22%3A16%2C%22actor_id%22%3A1429340672%2C%22story_id%22%3A1136908109435%2C%22ad_id%22%3A0%2C%22_ft_%22%3A%22%22%2C%22location%22%3A%22permalink%22%7D%2C%22story_id%22%3A%22u_0_n%22%2C%22caret_id%22%3A%22u_0_o%22%7D',
	'status_text' : 'playing%20next%20thursday%20(may%2014th)%20%40%20salvador%20darling123456',
	'status' : 'playing%20next%20thursday%20(may%2014th)%20%40%20salvador%20darling123456',
	'save' : '1',
	'__user' : '1429340672',
	'__a' : '1',
	'__dyn' : '7AmajEzUGByA5Q9UoHaEWC5EWq2WiWF3oyeqrWo8ponUKezob4q2i5U4e2CEaUgxebkwy6UnGiex2uVWxeUW6UO4GDgdUHDBxe6rCxaLGqu58nVV8-cxnxm1iyECium8yUgx66EK3O69L-4VZ1G7WAxx4zRzEWqq68G2unh45EgAxmnBCwNoy9Dw',
	'__af' : 'i0',
	'__req' : 'f',
	'__be' : '-1',
	'__pc' : 'PHASED%3ADEFAULT',
	'__rev' : '2846539',
	'ttstamp' : '26581717877112121115101901027958658170541148276811041188690'}

post_data = urllib.urlencode(post_params)
post_url = 'https://www.facebook.com/ajax/edits/save/?av=1429340672&dpr=1.5'
post_resp = br.open(post_url, post_data)

print post_resp.geturl()
print post_resp.info()
print post_resp.read()

post_back = br.back()

print post_back.read()

