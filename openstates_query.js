const request = require('superagent');

const openstatesApiKey = '82e9cac0-93e7-496c-9a76-565ed6233fdc';
const openstatesEndpoint = 'https://openstates.org/api/v1/bills';
const searchWindow = ''
const openstatesParams = { apikey: openstatesApiKey, state: 'tx', search_window: 'session', sort: 'updated_at' };

const openstatesQuery = () => {
  const a = request.get(openstatesEndpoint)
    .query(openstatesParams)
    .then(function(response) {
      console.log(response);
    });
  
}

function reducer(bill) {

}

openstatesQuery();
