google.charts.load('current');
google.charts.setOnLoadCallback(init);

function init() {
  var url =
    'https://docs.google.com/spreadsheets/d/1XxF6xfj03gAocNZ6dm_uNOAtr4QS9yD2LlzQZU-zIEo/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  query.setQuery('select A, B, D, L, Q');
  query.send(processSheetsData);
}

var searchArray = [];

function processSheetsData(response) {
    var array = [];
    var data = response.getDataTable();
    var columns = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    for (var r = 0; r < rows; r++) {
      var row = [];
      for (var c = 0; c < columns; c++) {
        row.push(data.getFormattedValue(r, c));
      }
      array.push({
        name: row[0],
        artist: row[1],
        year: row[4],
        album: row[2],
        // time: +row[3],
        
      });
    }
    // renderData(array);

    // console.log(array);
    searchArray = array;
    tableResults(array);
  }

var tbody = d3.select("tbody");

var years = [];
var song1Values = [];

// Generate HTML Table with all data
function tableResults(items) {

    var i = 1;
    var songYearCount = 1;
    var releaseYear = "1000"

    // Iterate through each item object
    items.forEach((item) => {

        // Append one table row `tr` to the table body
        var row = tbody.append("tr");

        //Iterate through each key and value
        Object.entries(item).forEach(([key, value]) => {    
  
          // Use the key to determine which array to push the value to
            if (key === "name") {
                var tdTitle = row.append("td");
                var aTitle = tdTitle.append("a").text(value);
                // aAlbum.attr("id", "album-"+ i.toString());
            }
            // else if (key === "wikipedia_url") {
            //     var idAlbum = "#album-" + i.toString()
            //     // console.log(idAlbum)
            //     var tdURL = d3.select(idAlbum)
            //     tdURL.attr("href", value);
            //     tdURL.attr("target", "_blank")
            //     i += 1;
            //     // console.log(i);
            // }
            else if (key === "artist") {
                row.append("td").text(value);
            }
            else if (key === "year") {
                row.append("td").text(value);
                songReleaseYear = value.substring(0,4);
                if (songReleaseYear === releaseYear) {
                    songYearCount += 1;
                }
                else {
                    if (releaseYear != "1000") {
                        song1Values.push(songYearCount);
                    }
                    songYearCount = 1;
                    years.push(songReleaseYear);
                    releaseYear = songReleaseYear;
                }    
            }
            else if (key === "album") {
                row.append("td").text(value);
            }
        });
    });

    song1Values.push(songYearCount);
    songsByYear();
};

function songsByYear() {

    // Create the Trace
    var trace1 = {
        x: years,
        y: song1Values,
        type: "bar"
    };
    
    // Create the data array for the plot
    var data = [trace1];
    
    // Define the plot layout
    var layout = {
        title: "Songs by Year",
        xaxis: { title: "Year" },
        yaxis: { title: "Count" }
    };
    
    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar-plot", data, layout);
    
};

// Select the button
var button = d3.select("#filter-btn");

// // Add Clear Fields Button and Event Handler
// var clearButton = d3.select("#clear-btn");

// Select the form
var form = d3.select("form");

// Create event handlers 
button.on("click", runEnter);
form.on("submit", runEnter);

function runEnter() {

    // Prevent the page from refreshing
    d3.event.preventDefault();
    
    // Create JS Object for multiple input values
    var inputValues = {};

    inputValues.year = d3.select("#year").property("value");
    inputValues.name = d3.select("#name").property("value").toLowerCase();
    inputValues.artist = d3.select("#artist").property("value").toLowerCase();
    // console.log(inputValues);
    
    // Iterate JS Object
    var filteredData = searchArray;
 
    // Filter on each input value if one exists
    Object.entries(inputValues).forEach(([key, value]) => {
        if (value.length > 0) {
            filteredData = filteredData.filter(item => item[key].toLowerCase().includes(value));
        }
    });

    // Clear HTML table body and provide filtered results
    tbody.html("");
    tableResults(filteredData);
      
};


