const request = require('superagent');
const { google }  = require('googleapis');

const openstatesApiKey = '82e9cac0-93e7-496c-9a76-565ed6233fdc';
const openstatesEndpoint = 'https://openstates.org/api/v1/bills';
const searchWindow = ''

const openstatesQuery = (subj) => {
  // Query OpenStates API
  const data = request.get(openstatesEndpoint)
    .query(openstatesParams(subj))
    .then((response) => {
      const shapedBills = response.body.map(bill => shapeBill(bill));
      return shapedBills;
    });
  return data;
}

const openstatesParams = (subj) => {
  return {
      apikey: openstatesApiKey,
      state: 'tx',
      search_window: 'session',
      sort: 'updated_at',
      fields: 'bill_id,created_at,updated_at,title,session,subjects,actions,versions',
      subject: subj,
  };
}

const shapeBill = (bill) => {
  // Reduce raw data to just what we need
  return {
    session: bill.session,
    bill_id: bill.bill_id,
    title: bill.title,
    bill_url: shapeBillUrl(bill),
    filed_date: bill.created_at,
    last_status: shapeAction(bill),
    last_updated: bill.updated_at,
    // subjects: bill.subjects.join(', '),
  }
}

const shapeAction = (bill) => {
  // Strip weird value of `Effective on . . . . . . . . . . . . . . .`
  const action = bill.actions[bill.actions.length - 1].action;
  if (action == 'Effective on . . . . . . . . . . . . . . .') {
    return 'Completed'; // TK get better verbiage
  }
  return action;
}

const shapeBillUrl = (bill) => {
  // Safely get URL without crashing, since some bills don't have URLs for some reason?
  if (bill.versions.length > 0) {
    return bill.versions[bill.versions.length - 1].url;
  }
  return null;
}

// HERE'S THE SHEETS PART
const appendToSheet = (valueSet) => {
  // Authorize
  const privatekey = require("/Users/colin/Downloads/Beater.json");
  const jwtClient = new google.auth.JWT(
         privatekey.client_email,
         null,
         privatekey.private_key,
         ['https://www.googleapis.com/auth/spreadsheets']);
  jwtClient.authorize(function (err, tokens) {
   if (err) {
     console.log(err);
     return;
   } else {
     console.log("Successfully connected!");
   }
  });

  // Ship to the sheet
  const sheets = google.sheets('v4');
  const googleSheetId = '1fO-vfsIkNuUnfFFiKtnp0pydHmsaLTFt1VgSvguDiAs';
  return sheets.spreadsheets.values.append({
    spreadsheetId: googleSheetId,
    range: 'Sheet1',
    auth: jwtClient,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: valueSet.map(bill => [bill.session, bill.bill_id, bill.title, bill.bill_url, bill.filed_date, bill.last_status, bill.last_updated]),
    },
  });
}

['Reproductive Issues', 'Sexual Orientation and Gender Issues', 'Health', 'Family and Children Issues'].forEach((subj) => {
  openstatesQuery(subj).then((set) => appendToSheet(set));
})
