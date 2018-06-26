# naraltx-bill-tracker

NARAL TX needs to track certain specific bills going thru the Texas state
legislature. In June 2018 they are doing this entirely by hand.

The SunlightFoundation has an API called OpenStates which tracks state
legislative activity, and adds some metadata. We can use this to get legislation
we're interested in automatically, so NARAL doesn't have to pull that down by
hand.

## How to use if you are not a programmer

This requires a little bit of action on your part as a policy person tracking
legislation; specifically, programmers can dump information in, but can't
tell you if you like it or not. The spreadsheet has a few additional columns
that you should write TRUE or FALSE in to mark things as urgent or important.

## How this works

* `openstates_query.js` is a script that queries an API and dumps that into a
  google spreadsheet.
* `card_styling.css` and `card_populating.js` are assets to load into Wordpress
  to get the cards to show up and be properly styled.

## To set up from scratch

First, rig up permissions:

* Create a Google Spreadsheet and set it so that anyone with the link can view.
  Give edit permissions to any individuals who needs to edit (but not everyone
  with the link).
* Make a Google Cloud account. Turn on the Google Sheets API. Get a
  service-to-service json key and a regular api key -- you'll need the json to
  write to google sheets and the regular api key to read.
* Get an OpenStates API key at https://openstates.org/api/register/ .

Next, rig up stuff (VERY TK):

* Plug your Google API key into Wordpress. Detailed instructions TK.
* Plug your Google service-to-service key into Google Lambda Like Service TK.
  Install superagent too TK.
* Set up `openstates_query.js` to run ever hour TK. Edit LX to point it to the
  spreadsheet ID you're using TK.
* Copy and paste `card_populating.js` and `card_styling.css` into the
  right place in Wordpress TK. On LX of `card_populating.js`, make an edit
  for the proper URL TK.

Finally, get it showing up (Less but somewhat TK):

* Run `openstates_query.js` to populate the initial spreadsheet TK.
* Nav to the page and admire TK.

## Setting up for development locally

* Set up a spreadsheet and API keys
* Plug them into your env
* Get `node` set up if it isn't already (`brew install node` or similar)
* `npm i` to install superAgent

## Notes about the scripts

* `card_populating.js` depends on jquery ajax calls. If you don't use jquery
  you might have a bad time. We tried to keep it as vanilla JS as possible other
  than that, but we aren't using polyfills or anything like that to make sure
  it's compatible.
* Since `openstates_query.js` is serverside, you don't have to worry about
  polyfills or whatever, PROBABLY. This depends on superagent Promises so
  troubleshooting can be a little tricky at times.
* This is very deliberately structured to require only a google spreadsheet and
  some auth keys to the google spreadsheet, so nobody has to manage a database.


## Useful links

* https://openstates.org/tx/bills/811/HB1/
* https://capitol.texas.gov/BillLookup/BillNumber.aspx
* https://rewire.news/legislative-tracker/state/texas/
