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

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    console.log("Raw CSV data:", data);
    // 2.b: ... AND TRANSFORM DATA

    // rename/reformat variables used for both visualizations
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
        && d.city != null // filtered just one city for now, but will add interactivity later
    );
    //console.log("filtered data: ", filteredData1);

    const lineDataArr1 = filteredData1.map(d => ({
        date: d.date,
        meanTemp: d.meanTemp,
        city: d.city
    }))

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

    //console.log("x scale: ", lineDataArr1[0].date, " to ", lineDataArr1[lineDataArr1.length - 1].date)

    // y
    const yTempScale = d3.scaleLinear()
        .domain([0, 120])
        .range([height, 0]);

    // 4.a: PLOT DATA FOR CHART 1
    //create line
    const line1 = d3.line()
        .x(d => xDateScale(d.date))
        .y(d => yTempScale(d.meanTemp));

    // 5.a: ADD AXES FOR CHART 1
    // x (formatting date first)
    const formatDate = d3.timeFormat("%m/%d/%Y");
    const formatDateShort = d3.timeFormat("%b %Y");
    svg1_line.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xDateScale)
            .tickFormat(formatDateShort));

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

    // Update chart for first time:
    updateViz1("Indianapolis, IN");

    // Add category dropdown
    function updateViz1(selectedCategory) {
        const filteredData = lineDataArr1.filter(d => d.city === selectedCategory);

        //remove existing line
        svg1_line.selectAll("path.data-line").remove();

        // remove tooltip points
        svg1_line.selectAll(".data-point").remove();

        // redraw line
        svg1_line.append("path")
            .datum(filteredData) // bind data with datum()
            .attr("class", "data-line")
            .attr("d", line1)
            .attr("stroke", "purple")
            .attr("stroke-width", 3)
            .attr("fill", "none");

        // redraw tooltip points
        svg1_line.selectAll(".data-point") // Create tooltip events
            .data(filteredData) // Bind data
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
    }

    // Event Listeners
    d3.select("#categorySelect").on("change", function () {
        const selectedCategory = d3.select(this).property("value");
        updateViz1(selectedCategory);
    });

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================
    function getRecordData(recordType) {
            const counts = d3.rollup(
                data.filter(d => {
                    const y = +d[`record_${recordType}_temp_year`];
                    return !isNaN(y) && y >= 1850 && y <= 2025;
                }),
                v => v.length,
                d => +d[`record_${recordType}_temp_year`]
            );

            return Array.from(counts, ([year, count]) => ({
                year: +year,
                count: +count
            })).sort((a, b) => a.year - b.year);
        }

        function drawRecordChart(recordType) {
            const chartData = getRecordData(recordType);

            svg2_RENAME.selectAll("*").remove(); // clear chart

            const x = d3.scaleLinear()
                .domain(d3.extent(chartData, d => d.year))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(chartData, d => d.count)])
                .range([height, 0]);

            const maxLine = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.count));

            svg2_RENAME.append("path")
                .datum(chartData)
                .attr("fill", "none")
                .attr("stroke", recordType === "max" ? "red" : "blue")
                .attr("stroke-width", 2)
                .attr("d", maxLine);

            svg2_RENAME.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.format("d")));

            svg2_RENAME.append("g")
                .call(d3.axisLeft(y));

            svg2_RENAME.append("text")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .text(`Record ${recordType === "max" ? "Max" : "Min"} Temperatures by Year`);

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
        }

        // Initialize with record max chart
        drawRecordChart("max");

        // Add event listener for dropdown
        d3.select("#recordTypeSelect").on("change", function () {
            const selected = d3.select(this).property("value");
            drawRecordChart(selected);
        });
    });