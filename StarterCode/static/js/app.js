// Plotly Challenge - creating Graphs using Plotly and D3

// Use D3 to read the JSON file and store in variables
d3.json("samples.json").then((ImportedData) => {
    
    var names = ImportedData.names;

    // insert the names in the dropdown menu
    d3.select("#selDataset").selectAll("div")
        .data(names)
        .enter()
        .append("option")
        .html(d => d);

    //call these functions to display the 1st entry's data

    demographics(names[0]); 
    buildCharts(names[0]);
});

//  This function will get the metadata for the new sample
function demographics(newSubject) {

    console.log('Running demographics Function');

    d3.json("samples.json").then((ImportedData) => {
        var metadata = ImportedData.metadata;
        var filteredData = [];

        filteredData = metadata.filter(id => id.id == newSubject);
        var webPage = d3.select("#sample-metadata");
        
        // Clear prior metadata
        webPage.html("");
        
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            webPage.insert("h6").text(`${key}:  ${value}`);
        });
    });

};

// Function called by DOM change to get data for charts
function optionChanged(newSubject) {

    console.log('Running optionChanged Function')
    var dropdownMenu = d3.selectAll("#selDataset").node();
    var newSubject = dropdownMenu.value;
    console.log(`New Test Subject Id: ${newSubject}`)

    demographics(newSubject);
    buildCharts(newSubject);
};

function buildCharts(sample) {
    console.log('Running buildCharts Function')
    d3.json("samples.json").then((ImportedData) => {

        var samples = ImportedData.samples;
        var filteredSample = samples.filter(id => id.id == sample);

        var results = filteredSample[0];
 
        var otuIds = results.otu_ids;
        var otuLabels = results.otu_labels;
        var otuValues = results.sample_values;

        var firstTenIds = [];
        var firstTenValues = [];
        var firstTenLabels = [];

        // Slice the first 10 objects for plotting
        firstTenIds = otuIds.slice(0, 10).map(otu => `OTU ${otu}`).reverse();
        firstTenValues = otuValues.slice(0, 10).reverse();
        firstTenLabels = otuLabels.slice(0, 10).reverse();

        var trace = [
            { 
            x: firstTenValues,
            y: firstTenIds,
            text: firstTenLabels,
            type: "bar",
            orientation: "h"
            }
        ];
        var layout = {
            title: "Top 10 OTU's for Test Subject",
            margin: {t: 40, l: 60}
        };
        Plotly.newPlot("bar", trace, layout); 

        //  Creating the bubble chart with all of the data
        
        var idsColor = parseFloat(otuIds); 

        var trace2 = [
            { 
            x: otuIds,
            y: otuValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: otuValues,
                color: idsColor
            },
         }];
         var layout = {
             height: 600, 
             width: 1000
         }
        //Render the bubble plot to the HTML div tag
        Plotly.newPlot("bubble", trace2, layout);  
        
        //  Advanced Challenge:  Creating the guage chart with all of the data
        
        var wFreq = [];

        var metadata = ImportedData.metadata;
        filteredData = metadata.filter(id => id.id == sample);
        var results = filteredData[0]
        var wFreq = results.wfreq;

        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wFreq,
                title: { text: "Belly Button Washing Frequency - Scrubs Per Week" },
                type: "indicator",
                name: "speed",
                mode: "gauge"
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
    });     
};
