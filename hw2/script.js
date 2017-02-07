// Global var for FIFA world cup data
var allWorldCupData;

const height = 400;
const width = 500;

const padding = 25;
const barWidth = 20;

var currentSelection = 'attendance'; // Default starting selection

var chart;
var initialXSpace;
var spacing;
var initialYSpace;

function setup(selectedDimension) {
    chart = d3.select(".chart")
        .append("g");

    initialXSpace = 50;
    spacing = (width - initialXSpace) / allWorldCupData.length;
    initialYSpace = 40;

    /**** X Bottom Axis ****/
    var allYears = (function() {
        var result = [];

        for (i of allWorldCupData) {
            result.push(i.YEAR);
        }
        return result.reverse();
    })();

    var xScale = d3.scaleBand()
        .domain(allYears)
        .range([initialXSpace, width - spacing + barWidth]);

    var xAxis = d3.axisBottom(xScale);

    /**** Y Left Axis ****/
    var max = findMax(selectedDimension);

    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([spacing, height - initialYSpace])
        .nice();

    var yAxis = d3.axisLeft(yScale)
        .tickSizeOuter(0); // Outer tick size should have size 0

    /**** Bar Chart ****/
    chart.append("g")
        .attr("class", "yAxis")
        // css class for the axis
        .attr("transform", "translate(" + initialXSpace + "," + 0 + ")")
        .call(yAxis);

    chart.append("g")
        .attr("class", "xAxis")
        // css class for the axis
        // moving the axis to the right place
        .attr("transform", "translate(" + 0 + "," + (height - initialYSpace) + ")")
        // moving the axis to the right place
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
}


/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {
    /**** Y Left Axis ****/
    var max = findMax(selectedDimension);

    var yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([spacing, height - initialYSpace])
        .nice();

    var yNewAxis = d3.axisLeft(yScale)
        .tickSizeOuter(0); // Outer tick size should have size 0

    // Update the left axis
    chart.select('.yAxis')
        .call(yNewAxis)

    /**** Color scale ****/
    var colorScale = d3.scaleSqrt()
      .domain([max, 0])
      .range(["#87CEFA", "#42647F"]);

    //select all bars on the graph, take them out, and exit the previous data set.
    //then you can add/enter the new data set
    var bars = chart.selectAll(".bar")
        .remove()
        .exit()
        .data(allWorldCupData, function(d) {
            return d[selectedDimension];
        });

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return initialXSpace + (i * spacing);
        })
        .attr("y", function(d) {
            return (height - (initialYSpace)) - Math.abs(yScale(d[selectedDimension]) - yScale(0));
        })
        .attr("height", function(d) {
            return Math.abs(yScale(d[selectedDimension]) - yScale(0));
        })
        .attr("width", barWidth)
        .style("fill", function(d, i) { return colorScale(i); });

    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Output the selected bar to the console using console.log()

}

function findMax(selectedDimension) {
    var max = d3.max(allWorldCupData, function(d) {
        return parseInt(d[selectedDimension]);
    });

    return max;
}


var selection = document.getElementById('dataset');

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
    currentSelection = selection.options[selection.selectedIndex].value;
    updateBarChart(currentSelection);
}

/* DATA LOADING */

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function(error, csv) {

    csv.forEach(function(d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;

    setup(currentSelection);

    // Draw the Bar chart for the first time
    updateBarChart(currentSelection);
});
