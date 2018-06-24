'use strict';

var page = 'http://prochoicetexas.org/?page_id=3782&preview=true';
var productionPage = 'http://prochoicetexas.org/bill-tracker-2/';
var apiKey = 'AIzaSyARsKyuI7u_mrrHf5_VVW2PAXVJgbl9L5U';
var spreadsheetId = '1fO-vfsIkNuUnfFFiKtnp0pydHmsaLTFt1VgSvguDiAs';
var range = 'A:I';
var baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';

function callUrl(sheetId, range) {
 return baseUrl + sheetId + '/values/' + range + '/?key=' + apiKey;
}

function mapRowToJson(headerRow, row) {
 var shapedRow = {};
 for (var i = 0; i < headerRow.length; i++) {
   shapedRow[headerRow[i]] = row[i];
 }
 return shapedRow;
}

function mapToCard(bill) {
  // console.log(bill);
  return `<div class="card ${bill['Urgent'] ? 'urgent' : ''}">
            <div class="row text-center top">
              ${bill['Bill ID']}
            </div>
            <div class="row middle text-center">
              <div class="col-sm-12">Description: ${bill['Title'].substring(1,100)}...</div>
            </div>
            <div class="row bottom">
              <div class="col-sm-12">
                  ${bill['Last Status']} at ${bill['Last Updated']}
              </div>
            </div>
          </div>`;

}

jQuery(document).ready(function($) {
  if (window.location.href === page || window.location.href === productionPage) {
   var url = callUrl(spreadsheetId, range);
   jQuery.ajax({
     url: url,
     success: function(data) {
       // Turn it all into JSON
       var headerRow = data.values[0];
       var jsonResult = data.values.slice(1).map(function(row) {
         return mapRowToJson(headerRow, row);
       });

       // Clear out the div and replace it with results of sheet
       jQuery('.bill-tracker-content').empty();
       jsonResult.forEach(function(bill) {
         // Do something with bill
         jQuery('.bill-tracker-content').append(mapToCard(bill));
       });
     }
   });
  }
});
