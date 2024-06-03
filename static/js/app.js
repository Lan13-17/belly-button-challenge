// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    function sampleNumber(mdata) {
      return mdata.id == sample;
    }

    let filteredMetadata = metadata.filter(sampleNumber)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Add metadata to panel
    panel.append("li").text("ID: " + String(filteredMetadata.id));
    panel.append("li").text("ETHNICITY: " + String(filteredMetadata.ethnicity));
    panel.append("li").text("GENDER: " + String(filteredMetadata.gender));
    panel.append("li").text("AGE: " + String(filteredMetadata.age));
    panel.append("li").text("LOCATION: " + String(filteredMetadata.location));
    panel.append("li").text("BBTYPE: " + String(filteredMetadata.bbtype));
    panel.append("li").text("WFREQ: " + String(filteredMetadata.wfreq));
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples

    // Filter the samples for the object with the desired sample number
    function sampleNumber(n) {
      return n.id == sample;
    }

    let filteredSample = samples.filter(sampleNumber)[0];

    // Get the otu_ids, otu_labels, and sample_values
    otuIds = filteredSample.otu_ids
    otuLabels = filteredSample.otu_labels
    sampleValues = filteredSample.sample_values

    let otuData = []
    for (let i = 0; i < otuIds.length; i++){
      otuData.push({"ids":otuIds[i],"labels":otuLabels[i],"values":sampleValues[i]});
    }

    // Build a Bubble Chart
    let trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds
      }
    };
    
    let layout1 = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bateria'},
    };
    
    Plotly.newPlot('bubble', [trace1], layout1);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = {}
    for (let i = 0; i < otuIds.length; i++){
        yticks[otuIds[i]] = "OTU " + String(otuIds[i])
      }

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let slicedData = otuData.slice(0, 10);
    slicedData.reverse();

    let trace2 = {
      x: slicedData.map(object => object.values),
      y: slicedData.map(object => yticks[object.ids]),
      text: slicedData.map(object => object.labels),
      name: "OTU",
      type: "bar",
      orientation: "h"
    };

    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: 'Number of Bateria'},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    Plotly.newPlot("bar", [trace2], layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      dropdownMenu.append("option").text(names[i])
    }

    // Get the first sample from the list
    let firstSample = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample)
    buildCharts(firstSample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();