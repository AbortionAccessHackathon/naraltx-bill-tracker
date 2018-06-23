const request = require('superagent');

const openstatesApiKey = '82e9cac0-93e7-496c-9a76-565ed6233fdc';
const openstatesEndpoint = 'https://openstates.org/api/v1/bills';
const searchWindow = ''
const openstatesParams = {
  apikey: openstatesApiKey,
  state: 'tx',
  search_window: 'session',
  sort: 'updated_at',
  fields: 'bill_id,created_at,updated_at,title,session,action_dates,subjects',
  subject: 'Reproductive Issues' // TODO URL for this document, last action
};

const openstatesQuery = () => {
  const a = request.get(openstatesEndpoint)
    .query(openstatesParams)
    .then(function(response) {
      const shapedBills = response.body.map(bill => shapeBill(bill))
      console.log(shapedBills);
      return shapedBills;
    });
}

function shapeBill(bill) {
  return { 
    title: bill.title,
    filed_date: bill.created_at,
    updated_date: bill.updated_at,
    bill_id: bill.bill_id,
    session: bill.session,
    last_status: null,
    last_updated: bill.updated_at,
    bill_url: null,
    subjects: bill.subjects,
  }
} 

openstatesQuery();

// 'Reproductive Issues'
// 'Sexual Orientation and Gender Issues'
