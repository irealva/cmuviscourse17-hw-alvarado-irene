/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

var goalCellWidth = 2 * cellWidth - cellBuffer;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, goalCellWidth]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};

d3.json('data/fifa-matches.json', function(error, data) {
    teamData = data;

    // Set games scale
    var maxGames = d3.max(teamData, function(d) {
        return d.value["TotalGames"];
    })
    gameScale.domain([0, maxGames]);
    aggregateColorScale.domain([0, maxGames]);

    // Set goals scale
    var maxGoals = d3.max(teamData, function(d) {
        return d.value["Delta Goals"] + d.value["Goals Conceded"];
    })
    goalScale.domain([0, maxGoals]);

    // Fix keys in the games data so that it doesn't match with another existing team
    for (var i = 0; i < teamData.length; i++) {
        var games = teamData[i].value.games;
        for (var j = 0; j < games.length; j++) {
            // Store the country game name in another variable
            games[j].name = "x" + games[j].key;
            // Add a unique ID to each name
            games[j].key = teamData[i].key + "Game" + games[j].key;

        }

        teamData[i].value.games = games;
    }

    createTable();
    updateTable();
})

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function(error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function(d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {
    tableElements = teamData;


    // console.log(tableElements);

    // ******* TODO: PART II *******

    // ******* TODO: PART V (Extra Credit) *******

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {
    console.log("\n\n");
    console.log("UPDATING TABLE AGAIN");

    // select the body section of the table
    var table = d3.select('#matchTable').select('tbody');
    // console.log(table.node());

    rows = table.selectAll('tr')
        // Make sure we keep object consistency between our data and HTML Dom objects
        .data(tableElements, function(d) {
            return d.key;
        })
        .enter().append('tr');

    // Remove anything that is no longer in our tableElements variable
    table.selectAll('tr')
        .data(tableElements, function(d) {
            return d.key;
        })
        .exit().remove();


    // rows.order();

    // Create a cell for each row in each column
    var cells = rows.selectAll('td')
        // Return an array for each row [ cell1, cell2, cell3, etc.. ]
        .data(function(row, i) {
            // console.log(row);
            var result = [];

            if (row.value.type == "aggregate") {
                result.push(createCell('text', row.key));
                result.push(createCell('goals', {
                    "made": row.value["Goals Made"],
                    "lost": row.value["Goals Conceded"],
                    "delta": row.value["Delta Goals"]
                }));
                result.push(createCell('text', row.value.Result.label));
                result.push(createCell('bar', row.value.Wins));
                result.push(createCell('bar', row.value.Losses));
                result.push(createCell('bar', row.value.TotalGames));
            }

            if (row.value.type == "game") {
                result.push(createCell('text', row.name));
                result.push(createCell('goals', {
                    "made": row.value["Goals Made"],
                    "lost": row.value["Goals Conceded"],
                    "delta": (row.value["Goals Made"] - row.value["Goals Conceded"])
                }));
                result.push(createCell('text', row.value.Result.label));
                result.push(createCell('text', ""));
                result.push(createCell('text', ""));
                result.push(createCell('text', ""));
            }

            return result;
        })
        .enter()
        .append('td');
    // .attr("width", cellWidth)
    // .attr("height", cellHeight);


    // Get the cells that will have text
    var cellsWithText = cells.filter(function(d) {
        return d.vis == 'text';
    })
    cellsWithText.text(function(d) {
        return d.value;
    });

    // Get the cells that will have the bar charts
    var cellsWithBars = cells.filter(function(d) {
        return d.vis == 'bar';
    })

    cellsWithBars.append("svg")
        // Attributes of SVG
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        // Inside each svg add a rect for the bar
        .append("rect")
        .attr("width", function(d) {
            return gameScale(d.value);
        })
        .attr("height", barHeight)
        .attr("fill", function(d) {
            return aggregateColorScale(d.value);
        });

    // Get the cells that will have the bar charts
    var cellsWithGoals = cells.filter(function(d) {
        return d.vis == 'goals';
    })
    // console.log(cellsWithBars);

    // Update the width of the cell
    cellsWithGoals.attr("width", goalCellWidth);

    cellsWithGoals.append("svg")
        // Attributes of SVG
        .attr("width", goalCellWidth)
        .attr("height", cellHeight)
        // Inside each svg add a rect for the bar
        .append("rect")
        .attr("x", function(d) {
            var min = Math.min(d.value.made, d.value.lost);
            return goalScale(min);
        })
        .attr("width", function(d) {
            // The width will be the delta of made goals - lost goals
            return goalScale(Math.abs(d.value.delta));
        })
        .attr("height", barHeight)
        .attr("fill", function(d) {
            return goalColorScale(d.value.delta);
        })
        //Rounding corners of rect
        .attr("rx", 10)
        .attr("ry", 10);

    // Add ability to click on each row
    rows.on("click", updateList);

}

function createCell(vis, value) {
    var cell = {
        "type": "row",
        "vis": vis,
        "value": value
    };
    return cell;
}


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList(i, n) {
    // index to start removing from array
    var index = i + 1;
    tableElements.splice(index, n);
}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(currentRow, i) {
    // console.log(tableElements.length);
    var index = tableElements.indexOf(currentRow);

    nextRow = tableElements[index + 1];

    // If the currently clicked row is a team, not a game
    if (currentRow.value.type == "aggregate") {
        // If the next row is also a team, then expand on games
        if (nextRow == undefined || nextRow.value.type == "aggregate") {
            var games = currentRow.value.games;

            for (var j = 0; j < games.length; j++) {
                tableElements.splice((index + 1 + j), 0, games[j]);
            }
            // console.log(tableElements);
        }
        // If the next row is a game, we want to collapse the row
        if (nextRow != undefined && nextRow.value.type == "game") {
            collapseList(index, currentRow.value.games.length);
        }
    }

    updateTable();

    // ******* TODO: PART IV *******


}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {
    const margin = 10;
    const width = 500 - margin;
    const height = 900 - margin;

    var svg = d3.select('#tree')
        .attr("transform",
            "translate(" + margin/2 + "," + 0 + ")");;
        // .append('svg')
        // .attr('width', w)
        // .attr('height', h)
        // .append('svg:g')
        // .attr('transform', 'translate(0,40)');

    var root = d3.stratify()
        .id(function(d) {
            // console.log(d);
            return d.id;
        })
        .parentId(function(d) {
            let number = parseInt(d.ParentGame);

            if (d.ParentGame == "") {
                console.log("return the first: " + d.id)
                return "";
            }
            console.log("Number is: " + number);
            let parent = treeData[d.ParentGame];
            console.log(parent);
            console.log(parent.id);
            console.log("\n\n");
            return parent.id;
        })
        (treeData);


    var tree = d3.tree()
        .size([height, width]);

    var nodes = tree(root);

    // adds the links between the nodes
    var link = svg.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d) {
            return d.data.level;
        })
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x +
                "C" + (d.y + d.parent.y) / 2 + "," + d.x +
                " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
                " " + d.parent.y + "," + d.parent.x;
        });

    // adds each node as a group
    var node = svg.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // adds the circle to the node
    node.append("circle")
        .attr("r", 5)
        .style("stroke", function(d) {
            return d.data.type;
        })
        .attr('class', function(d) {
            var c = 'winner';

            if (d.data.Losses == "1") {
                c = 'loser';
            }

            return c;
        });

    // adds the text to the node
    node.append("text")
        .attr("dy", ".35em")
        // .attr("x", function(d) {
        //     console.log(d)
        //     return d.children ?
        //         (d.data.value + 4) * -1 : d.data.value + 4
        // })
        .attr("x", 10)
        // .style("text-anchor", function(d) {
        //     return d.children ? "end" : "start";
        // })
        .text(function(d) {
            // console.log(d);
            return d.data.Team;
        });
};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}

function printTable() {
    var string = "";
    var i = 0;

    for (row of tableElements) {
        console.log(row);
        string = string + i + ":" + row.key + "\n";
        i++;
    }

    console.log(string);
}
