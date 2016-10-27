function someChart() {
//=============================================================================
// CONFIG
//=============================================================================
  var margin = {top: 20, right: 50, bottom: 40, left: 50},
      width = 960 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // define non-deterministic x- and y-value accessors
  var xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };

  // add x-scale
  var x = d3.scale.linear();

  // add y-scale
  var y = d3.scale.linear();

  // add x-axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  // add y-axis
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // initialize line generator
  var line = d3.svg.line().x(X).y(Y);


//=============================================================================
// CHART INITIALIZATION
//=============================================================================
  function chart(selection) {
    selection.each(function(data) {

      // Convert data to standard representation greedily.
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      x
          .domain(d3.extent(data, function(d) { return d[0]; })) // input domain
          .range([0, width]);  // output range

      // Update the y-scale.
      y
          .domain(d3.extent(function(d) { return d[1]; }))  // input domain
          .range([0, height]);  // output range

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg")
          .attr("class", "center-block")  // NOTE: Bootstrap centering
        .append("g");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");
      gEnter.append("path").attr("class", "line");


//=============================================================================
// CHART UPDATES
//=============================================================================
      // Update outer dimensions.
      svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

      // Update inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Update the y-axis.
      g.select(".y.axis")
            .call(yAxis);

      // Update the line path.
      g.select(".line")
          .attr("d", line);

    });  // selection.each()
  }  // chart()


//=============================================================================
// GETTER/SETTER METHODS
//=============================================================================
  // The x-accessor for the path generator
  function X(d) {
    return x(d[0]);
  }

  // The x-accessor for the path generator
  function Y(d) {
    return y(d[1]);
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;  // use non-deterministic accessor
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;  // use non-deterministic accessor
    yValue = _;
    return chart;
  };

  return chart;

}  // someChart()
