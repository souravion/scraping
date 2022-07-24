function doGet(){ 

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('love');
    var rows = sheet.getDataRange().getValue();
    console.log(rows.length)
    var output=[];
    for(var i=0;i<rows.length;i++){
    
      var row = rows[i]
      var records= {};
      records['authorName'] = row[0];
      output.push(records);
    
    }
    console.log(output)
    result 
    return ContentService.createTextOutput(JSON.stringify({data: output})).setMimeType(ContentService.MimeType.JSON);
    
    }