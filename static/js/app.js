
// from data.js
var tableData = data;

// var jsonFile = "favoritealbums_df.json";
// var tableData = d3.json(jsonFile, function(data) {
//     console.log(data);
// });
// var tableData = JSON.parse(jsonFile);

// var csvFile = "favoritealbums_df.csv";
// var tableData = d3.csv(csvFile, function(data) {
//     console.log(data);
// });

// console.log(tableData);



// Use D3 to select the table
var table = d3.select("table");

// Use D3 to select the table body
var tbody = d3.select("tbody");

// Columns: `datetime`, `city`, `state`, `country`, `shape`, `durationMinutes`, 
// and `comments`

var years = [];
var album1Values = [];

// Generate HTML Table with all data
function tableResults(items) {

    var i = 1;
    var albumYearCount = 1;

    var releaseYear = "1900"


    // Iterate through each item object
    items.forEach((item) => {

        // Append one table row `tr` to the table body
        var row = tbody.append("tr");

        //Iterate through each key and value
        Object.entries(item).forEach(([key, value]) => {    
  
          // Use the key to determine which array to push the value to
            if (key === "artist") {
                row.append("td").text(value);
            }
            else if (key === "album") {
                var tdAlbum = row.append("td");
                var aAlbum = tdAlbum.append("a").text(value);
                aAlbum.attr("id", "album-"+ i.toString());
            }
            else if (key === "wikipedia_url") {
                var idAlbum = "#album-" + i.toString()
                // console.log(idAlbum)
                var tdURL = d3.select(idAlbum)
                tdURL.attr("href", value);
                tdURL.attr("target", "_blank")
                i += 1;
                // console.log(i);
            }

            else if (key === "release_date") {
                row.append("td").text(value);
                albumReleaseYear = value.substring(0,4);
                if (albumReleaseYear === releaseYear) {
                    albumYearCount += 1;
                }
                else {
                    if (releaseYear != "1900") {
                        album1Values.push(albumYearCount);
                    }
                    albumYearCount = 1;
                    years.push(albumReleaseYear);
                    releaseYear = albumReleaseYear;
                }
                 
            }
        });
    });

    album1Values.push(albumYearCount);
}


tableResults(tableData);



// Create the Trace
var trace1 = {
    x: years,
    y: album1Values,
    type: "bar"
};
  
// Create the data array for the plot
var data = [trace1];
  
// Define the plot layout
var layout = {
    title: "Albums by Year",
    xaxis: { title: "Year" },
    yaxis: { title: "Count" }
};
  
  // Plot the chart to a div tag with id "bar-plot"
Plotly.newPlot("bar-plot", data, layout);

// // Select the button
// var button = d3.select("#filter-btn");

// // Select the form
// var form = d3.select("form");

// // Create event handlers 
// button.on("click", runEnter);
// form.on("submit", runEnter);

// // Complete the event handler function for the form
// function runEnter() {

//     // Prevent the page from refreshing
//     d3.event.preventDefault();
    
//     // Select the input element and get the raw HTML node
//     var inputElement = d3.select("#datetime");
  
//     // Get the value property of the input element
//     var inputValue = inputElement.property("value");
//     console.log(inputValue.length)

//     // Filter on datetime   
//     var filteredData = tableData.filter(item => item.datetime === inputValue);
//     console.log(filteredData)

//     // If no input, then show full table, else generate new table results
//     if (inputValue.length === 0) {
//         tbody.html("");
//         tableResults(tableData);
//     }
//     else {
//         tbody.html("");
//         tableResults(filteredData);
//     }
      
// };

// var filteredData = tableData;

// // Complete the event handler function for the form
// function runEnter() {

//     // Prevent the page from refreshing
//     d3.event.preventDefault();
    
//     // Create JS Object for multiple input values
//     var inputValues = {};

//     inputValues.datetime = d3.select("#datetime").property("value");
//     inputValues.city = d3.select("#city").property("value").toLowerCase();
//     inputValues.state = d3.select("#state").property("value").toLowerCase();
//     inputValues.country = d3.select("#country").property("value").toLowerCase();
//     inputValues.shape = d3.select("#shape").property("value").toLowerCase();
//     console.log(inputValues);
    
//     // Iterate JS Object
//     var filteredData = tableData;
 
//     // Filter on each input value if one exists
//     Object.entries(inputValues).forEach(([key, value]) => {
//         if (value.length > 0) {
//             filteredData = filteredData.filter(item => item[key] === value);
//         }
//     });

//     // Clear HTML table body and provide filtered results
//     tbody.html("");
//     tableResults(filteredData);
      
// };
