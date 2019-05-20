//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1K-ztOKnUQfPOZNnP405qrwzh1yOXiSRhgrBBgECdJJo"; // Must publish this Google Sheet to the web
var sheet = "RLMG Archive"
var apiKey = "AIzaSyBNuRlRwVqtCkOJKZLWotovV9wik4n1OM8"

// Make "Enter" trigger the submit button
$("input").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#submit").click();
  }
});

// Get entries from Google sheet when page loads or when user clicks "Submit"
window.addEventListener("load", getJSON);
document.getElementById("submit").addEventListener("click", getJSON);

//Use user-entered search terms to define search variables
function defineSearch() {
  //Set variables based on user input
  var searchTerms = $("#search-bar").val();
  var searchTermArr = searchTerms.split(',');
  searchTermArr = trimArray(searchTermArr);
  return searchTermArr;
}

function getJSON() {

  // Get spreadsheet data in JSON format
  const xhr = new XMLHttpRequest();
  const url='https://spreadsheets.google.com/feeds/list/'+gsKey+'/1/public/full?alt=json';
  xhr.open("GET", url);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var sheetObj = JSON.parse(xhr.responseText);
      makeTable(sheetObj); //Call the function that formats this JSON into a table
    }
  }
}

function makeTable(jsObj) {

  var searchTermArr = defineSearch();

  // Header row
  var txt = "<table id='archive-entries'><tr id='table-title'><td>ENTRIES</td><td></td><td></td><td></td></tr><tr><td><br></td></tr>";
  var content;

  // Fill in table contents
  for (i=0; i<jsObj.feed.entry.length; i++) {
    //Add each field in the JSON object to a string. Make it lower case for searching later.
    content += " " + jsObj.feed.entry[i].gsx$projectname.$t.toLowerCase();
    content += " " + jsObj.feed.entry[i].gsx$drivenumber.$t.toLowerCase();
    content += " " + jsObj.feed.entry[i].gsx$companycode.$t.toLowerCase();
    content += " " + jsObj.feed.entry[i].gsx$ltonumber.$t.toLowerCase();
    content += " " + jsObj.feed.entry[i].gsx$drivecontents.$t.toLowerCase();
    content += " " + jsObj.feed.entry[i].gsx$projectmanagersproducers.$t.toLowerCase();
    content += " " + jsObj.feed.entry[i].gsx$featuredexhibits.$t.toLowerCase();

    // Turn content into an array where each word is its own element.
    //(This will also break up multi-word fields into separate elements.)
    content = content.split(" ");

    var hit = 0;
    for (j=0; j<searchTermArr.length; j++) {

      if (content.indexOf(searchTermArr[j].toLowerCase()) > -1) {
        hit = 1;
      }
    }

    // Make a new table row if this entry contains a search term or if no serach terms were entered.
    if (hit == 1 || searchTermArr == "") {
        // First row
        txt += "<tbody class='table-entry'><tr>" +
            "<td><span class='a "+(i+2)+" project-name editable'>"+jsObj.feed.entry[i].gsx$projectname.$t+"</span>" +
            "<span class='drive-no'> | Drive #"+jsObj.feed.entry[i].gsx$drivenumber.$t+"</span></td>" +
            "<td></td><td></td>" +
            "<td class='company-code'>"+jsObj.feed.entry[i].gsx$companycode.$t+"</td></tr></div>" +

        // Second row
            "<tr><td class='date-range'><span>"+jsObj.feed.entry[i].gsx$projectstartdate.$t+" – </span>" +
            "<span>"+jsObj.feed.entry[i].gsx$projectenddate.$t+"</span></td>" +
            "<td></td><td></td>" +
            "<td class='lto-no'>LTO Tape " + jsObj.feed.entry[i].gsx$ltonumber.$t + "</td></tr>" +

        // Third row
            "<tr><td><a href="+jsObj.feed.entry[i].gsx$vimeoalbumlink.$t+">"+jsObj.feed.entry[i].gsx$vimeoalbumlink.$t+"</a></td></tr>" +
            "<tr><td><br></td></tr>" +

        // Fourth row
            "<tr><td class='heading'>Drive Contents</td>" +
            "<td class='heading'>Project Specs</td>" +
            "<td class='heading'>Project Manager(s) / Producer(s)</td>" +
            "<td class='heading'>Featured Exhibits</td></tr>" +

        // Fifth row
            "<tr><td>"+jsObj.feed.entry[i].gsx$drivecontents.$t+"</td>" +
            "<td>"+jsObj.feed.entry[i].gsx$projectspecs.$t+"</td>" +
            "<td>"+jsObj.feed.entry[i].gsx$projectmanagersproducers.$t+"</td>" +
            "<td>"+jsObj.feed.entry[i].gsx$featuredexhibits.$t+"</td></tr>" +
            "<tr><td><br></td><td></td><td></td><td></td></tr>" +
            "<tr class='last-row'><td><br></td><td></td><td></td><td></td></tr>" +
            "</tr></tbody>";
      }

    }

  txt += "</table>";
  document.getElementById("showData").innerHTML = txt;
}

//When the user clicks on the button, toggle between hiding and showing the dropdown content
document.getElementById("dropbtn").addEventListener("click", toggle);

function toggle() {
  document.getElementById("sort-dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('#dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.getElementById("sort-project").addEventListener("click", function() {
  sortTable("project-name");
});
document.getElementById("sort-drive").addEventListener("click", function() {
  sortTable("drive-no");
});
document.getElementById("sort-lto").addEventListener("click", function() {
  sortTable("lto-no");
});

function sortTable(sortOn) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("archive-entries");
  switching = true;

  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = document.getElementsByClassName('table-entry');
    /* Loop through all archive entries: */
    for (i = 0; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = $(".table-entry:eq(" + i + ") ." + sortOn).text();
      y = $(".table-entry:eq(" + (i+1) + ") ." + sortOn).text();

      // Clean up x and y depending on the sort value
      if (sortOn == "drive-no") {
        x = parseInt(x.split("#")[1]);
        y = parseInt(y.split("#")[1]);
      }

      if (sortOn == "lto-no") {
        x = parseInt(x.split(" ")[2]);
        y = parseInt(y.split(" ")[2]);
      }

      if (sortOn == "project-no") {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }

      // Check if the two rows should switch place:
      if (x > y) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
      switching = true;
    }
  }
}

// Trim the leading and trailing white space out of each array item
function trimArray(arr) {
  for(i=0;i<arr.length;i++)
  {
    arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}

// TESTING front-end Edit
// Below code didn't work because element is being loaded dynamically.
// $(document).ready(function() {
//   $(".table-entry td").click(function() {
//     console.log("Here");
//   });
// });

// Once the element has loaded (dynamically), call editField.
$(document).on('click','.table-entry .editable', editField);

function editField() {

  var target = event.target;
  var cell = target.className.split(" ")[0] + target.className.split(" ")[1];
  target.innerHTML = "<input type='text' size=60 name='edit-bar' id='edit-bar' value='' placeholder='New value' /><input id='submit-edit' type='submit' value='Submit' class='btn btn-default' />"

  // Submit the new value on enter
  $("input").keyup(function(event) {
    if (event.keyCode === 13) {
      $("#submit-edit").click();
    }
  });

  // When the user submits a new value, change the content to that value
  $("#submit-edit").click(function() {
    target.innerHTML = $("#edit-bar").val(); //change the entry as it appears on the page; still have to pass this into the spreadsheet

    var newVal = {
      "valueInputOption": "RAW", //takes user-entered value literally, rather than interpreting it as a formula
      "data": [ //data to pass in as JSON object
        {
          "range": sheet + "!" + cell,
          "values": [
            [$("#edit-bar").val()] //the new, user-entered value
          ]
        }
      ]
    }

    console.log(cell)
    $.ajax({
      url: 'https://sheets.googleapis.com/v4/spreadsheets/'+gsKey+'/values/' + sheet + '!' + cell + '?key='+apiKey,  //API url
      type: 'PUT',   //any HTTP method
      data: {
        data: newVal
      },      //Data as js object
      success: function () {
      }
    });

  });

  console.log(target);
}
