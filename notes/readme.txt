Upload files by submitting form data to API endpoint (same as done with web forms)
See test.html for example of how to submit to puu.sh

Doesn't look like username or password is included in request

Params appear to be:

k - logged in user's API key (also found in http://puush.me/account/settings)
c - md5 hash of the file contents
z - always the string "poop"
f - the file content


response looks something like this:

0,http://puu.sh/84elG.txt,119219160,0
0,http://puu.sh/84emE.txt,119219220,0

if you puush the same file twice (even with same hash), it will be stored under 2 different URLs
