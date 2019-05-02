//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1LST9-FQj7HKwGB3TyyaUay4fMpS7-B4_0fafC_EOGlY";

// Make "Enter" trigger the submit button
$("input").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btn").click();
  }
});

//Use user-entered search terms to define search variables
function defineSearch() {
  //Set variables based on user input
  var searchTerms = $("#search-terms").val();

  //Call the function that will formulate a query for Google Sheets
  formulateQuery(searchTerms);

}

//Formulate a query for Google Sheets based on user-entered search terms
function formulateQuery(searchTerms) {

    //Initialize an array that will hold the query sent to Google Sheets
    var queryArr = [];

    //If search terms are set, add them all to the query.
    if (searchTerms) {
      var searchTermArr = searchTerms.split(',');
      searchTermArr = trimArray(searchTermArr);

      // Create an array that will search for the provided terms in each column
      var subQueryArr = [];
      for (i=0;i<searchTermArr.length;i++) {
        // NOTE: Exclude any columns with dates or other non-text formats\
        subQueryArr.push("lower(A) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(B) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(E) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(F) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(G) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(H) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(I) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(J) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(K) contains lower('"+searchTermArr[i]+"')");

      // Add the subquery to the main array of query segments
      if (subQueryArr) {
        queryArr.push(subQueryArr.join(" OR "));
      }
    }

    }

    var gsQuery; // Initialize a string to hold the query string

    //If no search terms are set, print a log message.
    if (!searchTerms) {
      console.log("No search terms set");
      gsQuery = "SELECT *";
    } else {
      gsQuery = "SELECT * WHERE "+queryArr.join(" OR ");
    }
    console.log("Formulated query: "+gsQuery);

    makeTable(searchTerms)

  }

  function makeTable(searchTerms) {

    // Get spreadsheet data in JSON format
    const xhr = new XMLHttpRequest();
    const url='https://spreadsheets.google.com/feeds/list/'+gsKey+'/1/public/full?alt=json';
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange=(e)=>{
      var sheetObj = JSON.parse(xhr.responseText);
      // Header row
      var txt = "<table><tr id='table-title'><td>ENTRIES</td><td></td><td></td><td></td></tr><tr><td><br></td></tr>";
      var contentArr = [];

      // Fill in table contents
      for (i=0; i<sheetObj.feed.entry.length; i++) {
        //contentArr = [sheetObj.feed.entry[i].gsx$projectname.$t, sheetObj.feed.entry[i].gsx$drivenumber.$t, sheetObj.feed.entry[i].gsx$companycode.$t, sheetObj.feed.entry[i].gsx$ltonumber.$t, sheetObj.feed.entry[i].gsx$drivecontents.$t, feed.entry[i].gsx$projectmanagersproducers.$t, sheetObj.feed.entry[i].gsx$featuredexhibits.$t]
        //contentArr.push("Project name: "+sheetObj.feed.entry[i].gsx$projectname.$t);

        // First row
        txt += "<tr>";
        txt += "<td><span class='project-name'>"+sheetObj.feed.entry[i].gsx$projectname.$t+"</span>";
        txt += "<span class='drive-no'> | Drive #"+sheetObj.feed.entry[i].gsx$drivenumber.$t+"</span></td>";
        txt += "<td></td><td></td>"
        txt += "<td class='company-code'>"+sheetObj.feed.entry[i].gsx$companycode.$t+"</td></tr>";

        // Second row
        txt += "<tr><td><span>"+sheetObj.feed.entry[i].gsx$projectstartdate.$t+" – </span>";
        txt += "<span>"+sheetObj.feed.entry[i].gsx$projectenddate.$t+"</span></td>";
        txt += "<td></td><td></td>"
        txt += "<td class='lto-no'>LTO Tape " + sheetObj.feed.entry[i].gsx$ltonumber.$t + "</td></tr>"

        // Third row
        txt += "<tr><td><a href="+sheetObj.feed.entry[i].gsx$vimeoalbumlink.$t+">"+sheetObj.feed.entry[i].gsx$vimeoalbumlink.$t+"</a></td></tr>";
        txt += "<tr><td><br></td></tr>"

        // Fourth row
        txt += "<tr><td class='heading'>Drive Contents</td>"
        txt += "<td class='heading'>Project Specs</td>"
        txt += "<td class='heading'>Project Manager(s) / Producer(s)</td>"
        txt += "<td class='heading'>Featured Exhibits</td></tr>"

        // Fifth row
        txt += "<tr><td>"+sheetObj.feed.entry[i].gsx$drivecontents.$t+"</td>";
        txt += "<td>"+sheetObj.feed.entry[i].gsx$projectspecs.$t+"</td>";
        txt += "<td>"+sheetObj.feed.entry[i].gsx$projectmanagersproducers.$t+"</td>";
        txt += "<td>"+sheetObj.feed.entry[i].gsx$featuredexhibits.$t+"</td></tr>";
        txt += "<tr><td><br></td><td></td><td></td><td></td></tr>"
        txt += "<tr class='last-row'><td><br></td><td></td><td></td><td></td></tr>"
        txt += "</tr>";
      }

      txt += "</table>";
      document.getElementById("showData").innerHTML = txt;
    }

    //console.log("Project Names: "+contentArr);

}
//     var query = new google.visualization.Query(
//           'http://spreadsheets.google.com/tq?key='+gsKey+'&gid=0');
//
//       // Apply query language.
//       query.setQuery(gsQuery);
//
//       // Send the query with a callback function.
//       query.send(handleQueryResponse);
//   }
//
// function handleQueryResponse(response) {
//   if (response.isError()) {
//     console.log ("Error sending query");
//     alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
//     return;
//   }
//
//   var data = response.getDataTable();
//
//   // Add a class (table-cell) to each table cell so they can be accessed directly
//   var cssClassNames = {tableCell: 'table-cell'};
//   var options = {'cssClassNames': cssClassNames, 'showRowNumber': false, 'width': '100%', 'allowHtml': true};
//
//   // Only proceed if the search returns at least one row
//   if ((JSON.stringify(data)).includes('[]')) { //Any search with no results will return an empty array of rows
//     alert("No entries match your search.")
//   } else {
//     var hdTable = new google.visualization.Table(document.getElementById('showData'));
//
//     // var formatter = new google.visualization.PatternFormat(); //Can use this to format content of cells
//
//     //data.setProperty(0,9,'style','width:400px'); //This appears to be getting overridden
//
//     // Create a table with the returned rows
//     hdTable.draw(data, options);
//     $( ".table-cell" ).wrapInner( "<div class='table-div'></div>"); //Wrap them in a div with a specific class so they can be formatted directly
//   }
// }

// Trim the leading and trailing white space out of each array item
function trimArray(arr) {
  for(i=0;i<arr.length;i++)
  {
      arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}
