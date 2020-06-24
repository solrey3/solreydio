var searchArray = [];

google.charts.load('current');
google.charts.setOnLoadCallback(init);

function init() {
  var url =
    'https://docs.google.com/spreadsheets/d/1Brx0keahHs6i5k-4nBq1LGmx_9D6MfmST8P7B4hXc68/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  query.setQuery('select A, C, B, D, E');
  query.send(processSheetsData);
}



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
        rank: +row[0],
        album: row[1],
        artist: row[2],
        wikipedia_url: row[3],
        release_date: row[4]
        // time: +row[3],
        
      });
    }
    // renderData(array);

    // console.log(array);
    searchArray = array;
    tableResults(array);
  }

// Use D3 to select the table
var table = d3.select("table");

// Use D3 to select the table body
var tbody = d3.select("tbody");

var years = [];
var album1Values = [];
var artistAlbumName = [];
var artistAlbumCounts = [];


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
            if (key === "album") {
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
            else if (key === "artist") {
                row.append("td").text(value);
                var currentArtist = value;
                // If the word has been seen before...
                // if (currentArtist in artistAlbumCounts) {
                // // Add one to the counter
                // artistAlbumCounts[currentArtist] += 1;
                // }
                // else {
                // // Set the counter at 1
                // artistAlbumCounts[currentArtist] = 1;
                // }

                artistExists = false;
                              
                for(var j = 0; j < artistAlbumCounts.length; j++){
                    if(currentArtist === artistAlbumCounts[j].artist){
        
                        //word exists in word so count one up
                        artistAlbumCounts[j].count += 1;
                        artistExists = true;
                        break;
                                
                    }
                }

                if (artistAlbumCounts.length === 0) {
                    artistAlbumCounts.push({"artist":currentArtist, "count":1});
                }
                else if(!artistExists){
                    artistAlbumCounts.push({"artist":currentArtist, "count":1});
                }
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

    // filter() uses the custom function as its argument
    var rankedArray = items.filter(selectRanked);
    var sortedRankedArray = rankedArray.sort((a, b) => b.rank - a.rank);
    var rankList = d3.select("#rank-list");
    sortedRankedArray.forEach((rank) => {
        var rankItem = rankList.append("a").text(rank.rank +". "+ rank.album +" - "+ rank.artist +" ("+ rank.release_date +")");
        rankItem.attr("class", "list-group-item list-group-item-action");
        rankItem.attr("href", rank.wikipedia_url).attr("target", "_blank");
    });

    var multipleAlbumArtists = artistAlbumCounts.filter(selectMultipleArtists);
    var sortedMultipleAlbumArtists = multipleAlbumArtists.sort((a, b) => b.count - a.count);
    
    var artists = [];
    var albumTotals = [];
    sortedMultipleAlbumArtists.forEach((artist) => {
        artists.push(artist.artist);
        albumTotals.push(artist.count);
    });

        // Create the Trace
    var trace2 = {
        y: albumTotals,
        x: artists,
        type: "bar"
    };
    
    // Create the data array for the plot
    var data = [trace2];
    
    // Define the plot layout
    var layout = {
        title: "Albums by Artist",
        xaxis: { title: "Artist" },
        yaxis: { title: "Count" },
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          }
        
    };
    
    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("artist-bar-plot", data, layout);
            
}

// Create a custom filtering function
function selectRanked(album) {
    return album.rank > 0;
}

function selectMultipleArtists(album) {
    return album.count > 1;
}
 
