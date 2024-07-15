function roundNumbersToTwoDecimals(data) {
    for (const key in data) {
        data[key] = parseFloat(data[key].toFixed(2));
    }
    return data;
}

function roundToWholeNumber(value) {
    return Math.round(value);
}

function createRadarchart(ticker, container, tooltip_id) {
    const url = 'https://mavefund.com/api/v1/info/get_ranking?ticker=' + ticker;
    var res;
    fetch(url).then(response => response.json()).then(response => {
        response = roundNumbersToTwoDecimals(response[0])
        // console.log(response)
        var margin = {
                top: 100,
                right: 100,
                bottom: 100,
                left: 100
            },
            width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
        var arr = [];
        var obj = {};
        for (var x in response) {
            if (x == 'eps') {
                obj = {
                    axis: "EPS",
                    value: response[x]
                }
            }
            if (x == 'roe') {
                obj = {
                    axis: "ROE",
                    value: response[x]
                }
            }
            if (x == 'net_margin') {
                obj = {
                    axis: "NET MARGIN",
                    value: response[x]
                }
            }
            if (x == 'shares') {
                obj = {
                    axis: "SHARE BUYBACK",
                    value: response[x]
                }
            }
            if (x == 'leverage') {
                obj = {
                    axis: "LOW-LEVERAGE",
                    value: response[x]
                }
            }
            arr.push(obj);
        }
        var data = [];
        data[0] = (arr);
        var color = d3.scale.ordinal().range(["#C75532", "#00A0B0", "#CC333F"]);
        var radarChartOptions = {
            w: width,
            h: height,
            margin: margin,
            maxValue: 5,
            levels: 5,
            roundStrokes: true,
            color: color
        };
        RadarChart("." + container, data, radarChartOptions);

        function RadarChart(id, data, options) {
            var cfg = {
                w: 600,
                h: 600,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                },
                levels: 3,
                maxValue: 0,
                labelFactor: 1.45,
                wrapWidth: 60,
                opacityArea: 0.7,
                dotRadius: 4,
                opacityCircles: 0.1,
                strokeWidth: 2,
                roundStrokes: false,
                color: d3.scale.category10()
            };
            if ('undefined' !== typeof options) {
                for (var i in options) {
                    if ('undefined' !== typeof options[i]) {
                        cfg[i] = options[i];
                    }
                }
            }
            var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
                return d3.max(i.map(function(o) {
                    return o.value;
                }))
            }));
            var allAxis = (data[0].map(function(i, j) {
                    return i.axis
                })),
                total = allAxis.length,
                radius = Math.min(cfg.w / 2, cfg.h / 2) - 60,
                Format = d3.format('%'),
                angleSlice = Math.PI * 2 / total;
            var rScale = d3.scale.linear().range([0, radius]).domain([0, maxValue]);
            d3.select(id).select("svg").remove();
            var dim = Math.min(width, height)
            var svg = d3.select(id).append("svg").attr("width", '100%').attr("height", '100%').attr('viewBox', '0 0 ' + (dim + (dim / 2)) + ' ' + (dim + (dim / 2))).attr('preserveAspectRatio', 'xMinYMin').attr("class", "radar" + id);
            var g = svg.append("g").attr("transform", "translate(" + (dim + (dim / 2)) / 2 + "," + (dim + (dim / 2)) / 2 + ")");
            var filter = g.append('defs').append('filter').attr('id', 'glow'),
                feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
                feMerge = filter.append('feMerge'),
                feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
                feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
            var axisGrid = g.append("g").attr("class", "axisWrapper");
            axisGrid.selectAll(".levels").data(d3.range(1, (cfg.levels + 1)).reverse()).enter().append("circle").attr("class", "gridCircle").attr("r", function(d, i) {
                return radius / cfg.levels * d;
            }).style("fill", function(d, i) {
                if (i % 2 == 0) {
                    return "#2D3642"
                } else {
                    return "#424B58"
                }
            }).style("stroke", "#1B222D").style("fill-opacity", 1).style("filter", "url(#glow)");
            var axis = axisGrid.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");
            axis.append("line").attr("x1", 0).attr("y1", 0).attr("x2", function(d, i) {
                return rScale(maxValue * 1) * Math.cos(angleSlice * i - Math.PI / 2);
            }).attr("y2", function(d, i) {
                return rScale(maxValue * 1) * Math.sin(angleSlice * i - Math.PI / 2);
            }).attr("class", "line").style("stroke", "#424B58").style("stroke-width", "6px");

            function isMobileDevice() {
                return (window.innerWidth <= 768);
            }

            function isMacBook() {
                return window.screen.width === 1366 && window.screen.height === 768;
            }
            if (isMobileDevice()) {
                fontSize = "5px"
            } else if (isMacBook()) {
                fontSize = "18px"
            } else {
                fontSize = "25px"
            }
            axis.append("text").attr("class", "legend").style("font-size", fontSize).attr("text-anchor", "middle").attr("dy", "0em").attr("x", function(d, i) {
                if (d === 'LOW-LEVERAGE') {
                    return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) - 10;
                }
                return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
            }).attr("y", function(d, i) {
                if (isMobileDevice()) {
                    if (d == "SHARE BUYBACK" || d === "NET MARGIN" || d === "EPS") {
                        return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) + 5;
                    } else {
                        return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) - 10;
                    }
                } else {
                    if (d === "EPS" && isMacBook()) {
                        return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) + 15;
                    }
                    if (d === "EPS") {
                        return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) + 50;
                    } else {
                        return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
                    }
                }
            }).text(function(d) {
                return d
            }).call(wrap, cfg.wrapWidth);
            var radarLine = d3.svg.line.radial().interpolate("linear-closed").radius(function(d) {
                return rScale(d.value);
            }).angle(function(d, i) {
                return i * angleSlice;
            });
            if (cfg.roundStrokes) {
                radarLine.interpolate("cardinal-closed");
            }
            var blobWrapper = g.selectAll(".radarWrapper").data(data).enter().append("g").attr("class", "radarWrapper");
            blobWrapper.append("path").attr("class", "radarArea").attr("d", function(d, i) {
                return radarLine(d);
            }).style("fill", function(d, i) {
                return cfg.color(i);
            }).style("fill-opacity", cfg.opacityArea).on('mouseover', function(d, i) {
                d3.selectAll(".radarArea").transition().duration(200).style("fill-opacity", 0.1);
                d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
            }).on('mouseout', function() {
                d3.selectAll(".radarArea").transition().duration(200).style("fill-opacity", cfg.opacityArea);
            });
            blobWrapper.append("path").attr("class", "radarStroke").attr("d", function(d, i) {
                return radarLine(d);
            }).style("stroke-width", cfg.strokeWidth + "px").style("stroke", function(d, i) {
                return cfg.color(i);
            }).style("fill", "none").style("filter", "url(#glow)");
            var margin1 = {
                    top: 10,
                    right: 100,
                    bottom: 100,
                    left: 100
                },
                width1 = Math.min(900, window.innerWidth - 10) - margin.left - margin.right,
                height1 = Math.min(900, window.innerWidth - 10) - margin.left - margin.right;
            var radius = Math.min(width1, height1) / 2 - margin1.left
            var data = {
                a: 50,
                b: 50,
                c: 50,
                d: 50,
                e: 50
            }
            var color = d3.scaleOrdinal().domain(data).range(["transparent", "transparent", "transparent", "transparent", "transparent"])
            var pie = d3.pie().value(function(d) {
                return d.value;
            })
            var data_ready = pie(d3.entries(data))
            var host = `http://mavefund.com/company?key=${ticker}#`
            var urls = d3.scaleOrdinal().domain(data).range([host + "roe", host + "netmargin", host + "shares", host + "leaverag", host + "eps"])
            blobWrapper.selectAll('whatever').data(data_ready).enter().append('a').attr('href', function(d) {
                return (urls(d.data.key))
            }).append('path').attr('d', d3.arc().innerRadius(0).outerRadius(radius)).attr('fill', function(d) {
                return (color(d.data.key))
            }).attr("class", "cone").style("stroke-width", "2px").style("opacity", 0.4).style("rotate", "38deg").style("cursor", "pointer")
            g.selectAll('.cone').on("mouseover", function(d, blobWrapper) {
                this.setAttribute("fill", "#ffffff")
                var tooltip_data = {
                    earning_per_share: ["Earning per share", "EPS is a measure of a company's profitability, calculated by dividing net income by outstanding shares.", response['eps']],
                    return_on_assets: ["Return on Equity", "Return on Equity is a financial metric indicating a company's profitability relative to shareholders' equity.", response['roe']],
                    net_margin: ["Net margin", "Net margin is the percentage of profit a company retains from its total revenue.", response['net_margin']],
                    shares: ["Shares Buyback", "Share buyback is when a company purchases its own shares from the market.", response['shares']],
                    leverage: ["Low-Leverage", "Leverage refers to the use of borrowed capital or debt to increase the potential return on investment, but it also amplifies the potential for losses. Lower leverage means a higher score in the category, vice versa.", response['leverage']],
                }
                if (d.data.key == 'e') {
                    d3.select("#" + tooltip_id).style("left", d3.event.pageX - 450 + "px").style("top", d3.event.pageY - 250 + "px").style("opacity", 1).select("#number").text("1 | ");
                    d3.select("#heading_text").text(tooltip_data.earning_per_share[0]);
                    d3.select("#text").text(tooltip_data.earning_per_share[1]);
                    d3.select("#text").text(tooltip_data.earning_per_share[1]);
                    d3.select("#analysis_number").text(tooltip_data.earning_per_share[2] + "/5");
                    var icons = '';
                    for (var counter = 0; counter < roundToWholeNumber(tooltip_data.earning_per_share[2]); counter++) {
                        icons += '<i class="fa fa-check-circle" aria-hidden="true" style="color:#40ff00;"></i> ';
                    }
                    for (var counter = 0; counter < 5 - roundToWholeNumber(tooltip_data.earning_per_share[2]); counter++) {
                        icons += '<i class="fa fa-times-circle" aria-hidden="true" style="color:#ff0000;"></i> ';
                    }
                    d3.select("#icons").html(icons);
                }
                if (d.data.key == 'a') {
                    d3.select("#" + tooltip_id).style("left", d3.event.pageX - 450 + "px").style("top", d3.event.pageY - 250 + "px").style("opacity", 1).select("#number").text("2 | ");
                    d3.select("#heading_text").text(tooltip_data.return_on_assets[0]);
                    d3.select("#text").text(tooltip_data.return_on_assets[1]);
                    d3.select("#text").text(tooltip_data.return_on_assets[1]);
                    d3.select("#analysis_number").text(tooltip_data.return_on_assets[2] + "/5");
                    var icons = '';
                    for (var counter = 0; counter < roundToWholeNumber(tooltip_data.return_on_assets[2]); counter++) {
                        icons += '<i class="fa fa-check-circle" aria-hidden="true" style="color:#40ff00;"></i> ';
                    }
                    for (var counter = 0; counter < 5 - roundToWholeNumber(tooltip_data.return_on_assets[2]); counter++) {
                        icons += '<i class="fa fa-times-circle" aria-hidden="true" style="color:#ff0000;"></i> ';
                    }
                    d3.select("#icons").html(icons);
                }
                if (d.data.key == 'b') {
                    d3.select("#" + tooltip_id).style("left", d3.event.pageX - 450 + "px").style("top", d3.event.pageY - 250 + "px").style("opacity", 1).select("#number").text("3 | ");
                    d3.select("#heading_text").text(tooltip_data.net_margin[0]);
                    d3.select("#text").text(tooltip_data.net_margin[1]);
                    d3.select("#text").text(tooltip_data.net_margin[1]);
                    d3.select("#analysis_number").text(tooltip_data.net_margin[2] + "/5");
                    var icons = '';
                    for (var counter = 0; counter < roundToWholeNumber(tooltip_data.net_margin[2]); counter++) {
                        icons += '<i class="fa fa-check-circle" aria-hidden="true" style="color:#40ff00;"></i> ';
                    }
                    for (var counter = 0; counter < 5 - roundToWholeNumber(tooltip_data.net_margin[2]); counter++) {
                        icons += '<i class="fa fa-times-circle" aria-hidden="true" style="color:#ff0000;"></i> ';
                    }
                    d3.select("#icons").html(icons);
                }
                if (d.data.key == 'c') {
                    d3.select("#" + tooltip_id).style("left", d3.event.pageX - 450 + "px").style("top", d3.event.pageY - 250 + "px").style("opacity", 1).select("#number").text("4 | ");
                    d3.select("#heading_text").text(tooltip_data.shares[0]);
                    d3.select("#text").text(tooltip_data.shares[1]);
                    d3.select("#text").text(tooltip_data.shares[1]);
                    d3.select("#analysis_number").text(tooltip_data.shares[2] + "/5");
                    var icons = '';
                    for (var counter = 0; counter < roundToWholeNumber(tooltip_data.shares[2]); counter++) {
                        icons += '<i class="fa fa-check-circle" aria-hidden="true" style="color:#40ff00;"></i> ';
                    }
                    for (var counter = 0; counter < 5 - roundToWholeNumber(tooltip_data.shares[2]); counter++) {
                        icons += '<i class="fa fa-times-circle" aria-hidden="true" style="color:#ff0000;"></i> ';
                    }
                    d3.select("#icons").html(icons);
                }
                if (d.data.key == 'd') {
                    d3.select("#" + tooltip_id).style("left", d3.event.pageX - 450 + "px").style("top", d3.event.pageY - 250 + "px").style("opacity", 1).select("#number").text("5 | ");
                    d3.select("#heading_text").text(tooltip_data.leverage[0]);
                    d3.select("#text").text(tooltip_data.leverage[1]);
                    d3.select("#text").text(tooltip_data.leverage[1]);
                    d3.select("#analysis_number").text(tooltip_data.leverage[2] + "/5");
                    var icons = '';
                    for (var counter = 0; counter < roundToWholeNumber(tooltip_data.leverage[2]); counter++) {
                        icons += '<i class="fa fa-check-circle" aria-hidden="true" style="color:#40ff00;"></i> ';
                    }
                    for (var counter = 0; counter < 5 - roundToWholeNumber(tooltip_data.leverage[2]); counter++) {
                        icons += '<i class="fa fa-times-circle" aria-hidden="true" style="color:#ff0000;"></i> ';
                    }
                    d3.select("#icons").html(icons);
                }
            });
            g.selectAll('.cone').on("mouseout", function(d, blobWrapper) {
                this.setAttribute("fill", "transparent")
                d3.select("#" + tooltip_id).style("opacity", 0)
            });

            function wrap(text, width) {
                text.each(function() {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word, line = [],
                        lineNumber = 0,
                        lineHeight = 1.4,
                        y = text.attr("y"),
                        x = text.attr("x"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                    }
                });
            }
        }
    }).catch(err => console.log(err));
}