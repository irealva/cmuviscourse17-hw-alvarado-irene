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
        .transition().duration(750).ease(d3.easeSin)
        .call(yNewAxis);

    /**** Color scale ****/
    var colorScale = d3.scaleSqrt()
        .domain([max, 0])
        .range(["#87CEFA", "#42647F"]);

    //select all bars on the graph, take them out, and exit the previous data set.
    //then you can add/enter the new data set
    var bars = chart.selectAll(".bar")
        .data(allWorldCupData, function(d) {
            return d;
        })
        .exit()
        .attr("opacity", 1)
        .transition()
        .duration(1500)
        .attr("opacity", 0)
        .remove()

    var newBars = chart.selectAll(".bar")
        .data(allWorldCupData, function(d) {
            return d;
        })

    newBars.enter()
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
        .style("fill", function(d, i) {
            return colorScale(i);
        })
        .attr("opacity", 0)
        .transition()
        .duration(1500)
        .attr("opacity", 1);

    var barDOM = d3.selectAll(".chart .bar");
    barDOM.on("click", function(){
        var currentClass = d3.select(this).attr("class");

        if(currentClass === "bar") {
            d3.select(this).attr("class", "bar highlight")
        }
        else {
            d3.select(this).attr("class", "bar")
        }

        console.log(d3.select(this).node());
    })
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

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART II *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.


}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    // ******* TODO: PART III *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map

    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)


}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART IV*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.

}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART IV *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.



}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

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
    allWorldCupData = allWorldCupData.reverse();

    setup(currentSelection);

    // Draw the Bar chart for the first time
    updateBarChart(currentSelection);
});