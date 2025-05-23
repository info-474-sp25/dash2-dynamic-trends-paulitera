// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_line = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
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
    // x (parse date first)
    const parseDate = d3.timeParse("%m/%d/%Y");
    lineDataArr1.forEach(d => {
        d.date = parseDate(d.date);
    });
    const xDateScale = d3.scaleTime()
        .domain([lineDataArr1[0].date, lineDataArr1[lineDataArr1.length - 1].date])
        .range([0, width]);

    console.log("x scale: ", lineDataArr1[0].date, " to ", lineDataArr1[lineDataArr1.length - 1].date)

    // y
    const yTempScale = d3.scaleLinear()
        .domain([0, 120])
        .range([height, 0]);

    // 4.a: PLOT DATA FOR CHART 1
    //create line
    const line1 = d3.line()
        .x(d => xDateScale(d.date))
        .y(d => yTempScale(d.meanTemp));

    // plot line
    svg1_line.append("path")
        .datum(lineDataArr1) // bind data with datum()
        .attr("d", line1)
        .attr("stroke", "purple")
        .attr("stroke-width", 3)
        .attr("fill", "none");

    // 5.a: ADD AXES FOR CHART 1
    // x
    const formatDate = d3.timeFormat("%m/%d/%Y");
    svg1_line.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xDateScale)
            .tickFormat(formatDate));

    // y
    svg1_line.append("g")
        .call(d3.axisLeft(yTempScale));

    // 6.a: ADD LABELS FOR CHART 1
    // x
    svg1_line.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + (margin.bottom / 2) + 10)
        .text("Date");

    // y
    svg1_line.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left / 2)
        .attr("x", -height / 2)
        .text('Mean Temperature (' + String.fromCharCode(176) + 'F)');

    // 7.a: ADD INTERACTIVITY FOR CHART 1
    // // Tooltip
    const tooltip = d3.select("body") // Create tooltip
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("font-size", "12px");

    svg1_line.selectAll(".data-point") // Create tooltip events
        .data(lineDataArr1) // Bind data
        // .data([selectedCategoryData]) // D7: Bind only to category selected by dropdown menu
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xDateScale(d.date))
        .attr("cy", d => yTempScale(d.meanTemp))
        .attr("r", 10)
        .style("fill", "steelblue")
        .style("opacity", 0)  // Make circles invisible by default
        // --- MOUSEOVER ---
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible")
                .html(`<strong>Date:</strong> ${formatDate(d.date)} <br><strong>Temperature:</strong> ${d.meanTemp}`)
                .style("top", (event.pageY + 10) + "px") // Position relative to pointer
                .style("left", (event.pageX + 10) + "px");

            // Create the large circle at the hovered point
            svg1_line.append("circle")
                .attr("class", "hover-circle")
                .attr("cx", xDateScale(d.date))  // Position based on the x scale (date)
                .attr("cy", yTempScale(d.meanTemp)) // Position based on the y scale (mean temp)
                .attr("r", 6)  // Radius of the large circle
                .style("fill", "purple") // Circle color
                .style("stroke-width", 2);
        })
        // --- MOUSEOUT ---
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");

            // Remove the hover circle when mouseout occurs
            svg1_line.selectAll(".hover-circle").remove();

            // Make the circle invisible again
            d3.select(this).style("opacity", 0);  // Reset opacity to 0 when not hovering
        });

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
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");

    svg2_RENAME.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Count");

    // 7.b: ADD INTERACTIVITY FOR CHART 2


});