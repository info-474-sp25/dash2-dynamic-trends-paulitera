// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_RENAME = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2_RENAME = d3.select("#lineChart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    console.log("Raw CSV data:", data);
    // 2.b: ... AND TRANSFORM DATA

    // rename/reformat variables used for both visualizations
    // TODO: add the variables for viz 2
    data.forEach(d => {
        d.date = d.date;
        d.record_max_temp_year = +d.record_max_temp_year;
        d.meanTemp = +d.actual_mean_temp;
        d.city = d.city_full;
    })

    console.log("reformated data: ", data);

    // ==========================================
    //         CHART 1: Mean Temperature
    // ==========================================

    // filter data by removing nulls
    const filteredData1 = data.filter(d =>
        d.date != null
        && d.meanTemp != null
        && d.city === "Indianapolis, IN" // filtered just one city for now, but will add interactivity later
    );

    // GROUP and AGGREGATE data
    const groupedData1 = d3.rollup(filteredData1,
        v => d3.mean(v, d => d.meanTemp),
        d => d.date
    )

    // turn data into array (no need to sort because it is already in order)
    const lineDataArr1 = Array.from(groupedData1,
        ([date, meanTemp]) => ({ date, meanTemp })
    );

    console.log("final data array (viz1): ", lineDataArr1);

    // 3.a: SET SCALES FOR CHART 1


    // 4.a: PLOT DATA FOR CHART 1


    // 5.a: ADD AXES FOR CHART 1


    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1


    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================
    const recordMaxCounts = d3.rollup(
    data.filter(d => {
    const y = +d.record_max_temp_year;
    return !isNaN(y) && y >= 1850 && y <= 2025;
    }),
    v => v.length,
    d => +d.record_max_temp_year
    );
    const maxDataUnsorted = Array.from(recordMaxCounts, ([year, count]) => ({
    year: +year,
    count: +count
    }));

    const maxData = maxDataUnsorted.sort((a, b) => a.year - b.year);

    // 3.b: SET SCALES FOR CHART 2

    const x = d3.scaleLinear()
        .domain(d3.extent(maxData, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(maxData, d => d.count)])
        .range([height, 0]);

    // 4.b: PLOT DATA FOR CHART 2

    const maxLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count));
    
     svg2_RENAME.append("path")
        .datum(maxData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", maxLine);

    // 5.b: ADD AXES FOR CHART

    svg2_RENAME.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg2_RENAME.append("g")
        .call(d3.axisLeft(y));

    // 6.b: ADD LABELS FOR CHART 2

    svg2_RENAME.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px");

    svg2_RENAME.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");

    svg2_RENAME.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Count");

    // 7.b: ADD INTERACTIVITY FOR CHART 2


});