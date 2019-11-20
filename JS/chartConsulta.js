$(function() {
    function createBarChart(htmlId, data) {
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = $(htmlId).width() - margin.left - margin.right,
        height = $(htmlId).height() - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([height, 0]);
        var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
            
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(htmlId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.estado; }));
        y.domain([0, d3.max(data, function(d) { return d.municipios; })]);
        colorScale.domain(data.map(function (d){ return d.municipios; }));

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.estado); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.municipios); })
            .attr("height", function(d) { return height - y(d.municipios); })
            .attr("fill", function (d){ return colorScale(d.municipios); });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg.select('.x.axis').selectAll("text").attr("y", 10).call(wrap, x.bandwidth());

        svg.selectAll(".text")  		
            .data(data)
            .enter()
            .append("text")
            .attr("class","label")
            .attr("x", (function(d) { return x(d.estado) + (x.bandwidth() / 2) ; }  ))
            .attr("y", function(d) { return y(d.municipios) - 15; })
            .attr("text-anchor", "middle")
            .attr("dy", ".75em")
            .text(function(d) { return d.municipios; });   
    }

    function createDonutChart(htmlId, data) {
        var width = $(htmlId).width();
        var height = $(htmlId).height();
        var margin = {top: 20, right: 20, bottom: 30, left: 40};
        var radius = Math.min(width, height)/2 * 0.8;
        var color = {
            "ROJA": "#FF0000",
            "NARANJA": "#FFA500",
            "AMARILLA": "#FFFF00",
            "VERDE": "#38BF34",
            "AZUL": "#4F81BC"
        };

        var svg = d3.select(htmlId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g");
            
        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");
            
        var pie = d3.pie().sort(null).value(d => d["municipios"]);
        var arc = d3.arc().innerRadius(radius*0.8).outerRadius(radius*0.6);
            
        var outerArc = d3.arc()
            .outerRadius(radius * 0.9)
            .innerRadius(radius * 0.9);
            
        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
        svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d,i) => color[d["data"]["color"]]);
        svg.append('g').classed('labels',true);
        svg.append('g').classed('lines',true);
            

        var polyline = svg.select('.lines')
            .selectAll('polyline')
            .data(pie(data))
            .enter().append('polyline')
            .attr('points', function(d) {
                // see label transform function for explanations of these three lines.
                var pos = outerArc.centroid(d);
                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos]
            });
                
        var label = svg.select('.labels').selectAll('text')
            .data(pie(data))
            .enter().append('text')
            .attr('dy', '.35em')
            .html(function(d) {
                const opciones = {
                    "AZUL": "Peligro Muy Bajo",
                    "VERDE": "Peligro Bajo",
                    "AMARILLA": "Peligro Medio",
                    "NARANJA": "Peligro Alto",
                    "ROJA": "Peligro Máximo"
                }

                return opciones[d["data"]["color"]] +  " (" + d["data"]["municipios"] + ")";
            })
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                return (midAngle(d)) < Math.PI ? 'start' : 'end';
            })
            .attr("font-size", "0.8em");
        
        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; } 
    }

    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }

    function createGroupedBarChart(htmlId, data) {
        var margin = {top: 55, right: 20, bottom: 30, left: 20},
            width = $(htmlId).width() - margin.left - margin.right,
            height = $(htmlId).height() - margin.bottom - margin.top;

        var y = d3.scaleLinear()
            .rangeRound([height, 0])
            .nice();

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .align(0.1)
            
        var z = {
            "ACERCÁNDOSE": "#E5D429",
            "ALEJANDOSE": "#A0C334"
        };

        var symbols = ["ACERCÁNDOSE", "ALEJANDOSE"];
        var layers = d3.stack().keys(symbols)(data);

        var max = d3.max(layers[layers.length-1], function(d) { return d[1]; });
        
        y.domain([0, max]);
        x.domain(data.map(d => d["estado"]).sort());
        
        // console.log(data, symbols);
        
        var svg = d3.select(htmlId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        g.selectAll("g")
            .data(layers)
            .enter()
            .append("g")
            .attr("class", "chart")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + ",0)")
            .style("fill", function(d) { return z[d.key]; })	
            .selectAll("rect")
            .data(function(d) {  return d; })
            .enter().append("rect")
            .attr("x", function(d, i) { return x(d.data.estado); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0];
                var yPosition = d3.mouse(this)[1] + 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d[1]-d[0]);
            });
        
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (height) + ")")
            .call(d3.axisBottom(x))
        
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft().scale(y))
            .append("text")
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start");

        svg.select('.x.axis').selectAll("text").attr("y", 10).attr("font-family", "0.5em").call(wrap, x.bandwidth());

        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "center")
            .selectAll("g")
            .data(symbols.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + (width + margin.left + margin.right)/2 + "," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", function(d) { return z[d]; });

        legend.append("text")
            .attr("x", 20)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");
              
        tooltip.append("rect")
            .attr("width", 60)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 30)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");
    }

    window.createBarChart = createBarChart;
    window.createDonutChart = createDonutChart;
    window.createGroupedBarChart = createGroupedBarChart;
});