var page = 'https://teambilltracker.wordpress.com/home-page/';
var apiKey = 'AIzaSyARsKyuI7u_mrrHf5_VVW2PAXVJgbl9L5U';
var spreadsheetId = '1fO-vfsIkNuUnfFFiKtnp0pydHmsaLTFt1VgSvguDiAs';
var range = 'A:I';
var baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';
var apiCallSettings = {
  dataType: 'json',
}

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

if (window.location.href === page) {
  var url = callUrl(spreadsheetId, range);
  jQuery.ajax({
    url: url,
    success: function(data) {
      // Turn it all into JSON
      var result = []
      var headerRow = data.values[0];
      var jsonResult = data.values.slice(1).map(function(row) {
        return mapRowToJson(headerRow, row);
      });

      jQuery('.site-content').empty();
      jsonResult.forEach(function(bill) {
        // Do something with bill
        var stringBill = JSON.stringify(bill);
        jQuery('.site-content').append(stringBill + '<br>');
      });
    }
  });
}
