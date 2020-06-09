// Use D3 to select the table
var table = d3.select("table");

// Use D3 to select the table body
var tbody = d3.select("tbody");

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
    }


var jsonFav = "https://solrey3.github.io/solreydio/data/favoritealbums.json";

Plotly.d3.json(jsonFav, function(favData) {
    tableResults(favData);
});

var jsonRank = "https://solrey3.github.io/solreydio/data/ranked.json";

Plotly.d3.json(jsonRank, function(ranks) {
    var rankList = d3.select("#rank-list");
    ranks.forEach((rank) => {
        var rankItem = rankList.append("a").text(rank.rank +". "+ rank.album +" - "+ rank.artist +" ("+ rank.release_date +")");
        rankItem.attr("class", "list-group-item list-group-item-action");
        rankItem.attr("href", rank.wikipedia_url).attr("target", "_blank");
    });
        
});

var jsonArtistCount = "https://solrey3.github.io/solreydio/data/artistcounts.json";

Plotly.d3.json(jsonArtistCount, function(artistAlbumCounts) {
    var artists = [];
    var albumTotals = [];
    artistAlbumCounts.forEach((artist) => {
        artists.push(artist.artist);
        albumTotals.push(artist.count);
    
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
    
    });

});
