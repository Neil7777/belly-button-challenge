// Create URL in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// Function to initialize the dashboard
function init() {
    // Use D3 to read the JSON file
    d3.json(url).then(data => {
        // Get the dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        // Populate the dropdown menu with subject IDs
        data.names.forEach(subjectID => {
            dropdownMenu.append("option").attr("value", subjectID).text(subjectID);
        });

        // Call function to update charts and demographic info based on the default subject ID
        updateCharts(data.names[0]);
    });
}

// Function to update charts and demographic info
function updateCharts(selectedSubject) {
    // Use D3 to read the JSON file again
    d3.json(url).then(data => {
        // Filter the data for the selected subject
        let selectedData = data.samples.filter(sample => sample.id === selectedSubject)[0];

        // Update bar chart
        updateBarChart(selectedData);

        // Update bubble chart
        updateBubbleChart(selectedData);

        // Get the metadata for the selected subject
        let metadata = data.metadata.filter(metadata => metadata.id === parseInt(selectedSubject))[0];

        // Update demographic info
        updateDemographicInfo(metadata);
    });
}

// Function to update bar chart
function updateBarChart(data) {
    // Sort data to get top 10 OTUs
    let sortedData = data.sample_values.slice(0, 10).reverse();
    let otuIds = data.otu_ids.slice(0, 10).reverse();
    let otuLabels = data.otu_labels.slice(0, 10).reverse();

    // Create trace
    let trace = {
        x: sortedData,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    let layout = {
        title: "Top 10 OTUs"
    };

    // Plot bar chart
    Plotly.newPlot("bar", [trace], layout);
}

// Function to update bubble chart
function updateBubbleChart(data) {
    // Create trace
    let trace = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: 'markers',
        marker: {
            size: data.sample_values,
            color: data.otu_ids,
            
        }
    };

    let layout = {
        title: "OTU Bubble Chart"
    };

    // Plot bubble chart
    Plotly.newPlot("bubble", [trace], layout);
}

// Function to update demographic info
function updateDemographicInfo(metadata) {
    // Select the metadata panel
    let metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Append each key-value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to handle dropdown menu change
function optionChanged(selectedSubject) {
    // Update charts and demographic info based on the selected subject
    updateCharts(selectedSubject);
}

// Initialize the dashboard
init();