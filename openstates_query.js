const request = require('superagent');

const openstatesApiKey = '82e9cac0-93e7-496c-9a76-565ed6233fdc';
const openstatesEndpoint = 'https://openstates.org/api/v1/bills';
const searchWindow = ''
const openstatesParams = {
  apikey: openstatesApiKey,
  state: 'tx',
  search_window: 'session',
  sort: 'updated_at',
  fields: 'bill_id,created_at,updated_at,title,session,subjects,actions,versions',
  subject: 'Reproductive Issues'
};

const openstatesQuery = () => {
  // Query OpenStates API
  const data = request.get(openstatesEndpoint)
    .query(openstatesParams)
    .then(function(response) {
      const shapedBills = response.body.map(bill => shapeBill(bill))
      console.log(shapedBills);
      return shapedBills;
    });
  return data;
}

const shapeBill = (bill) => {
  // Reduce raw data to just what we need
  return {
    title: bill.title,
    filed_date: bill.created_at,
    bill_id: bill.bill_id,
    session: bill.session,
    last_status: bill.actions[bill.actions.length - 1].action,
    last_updated: bill.updated_at,
    bill_url: shapeBillUrl(bill),
  }
}


const shapeBillUrl = (bill) => {
  // Safely get URL without crashing, since some bills don't have URLs for some reason?
  if (bill.versions.length > 0) {
    return bill.versions[bill.versions.length - 1].url;
  }
  return null;
}

const data = openstatesQuery();
return data;
