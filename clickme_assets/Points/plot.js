// Generated by CoffeeScript 1.7.1
(function() {
  var clip, deselect_color_groups, g_color_group_keys, g_color_title, g_points, g_toggle_names, keyuped, mouseout, mouseover, point_names, points, redraw, search, search_clear, search_input, show_all_colors, sidebar, single_group, tip, toggle_names, toggle_points, transform_points;

  plot.center.append("defs").append("clipPath").attr("id", "clip").append("rect").attr({
    "width": plot.width + 40,
    "height": plot.height
  });

  clip = plot.center.append("g").attr("clip-path", "url(#clip)");

  if (plot.zoom) {
    clip.append("rect").style({
      "cursor": "move"
    }).attr({
      "class": "overlay",
      "width": plot.width,
      "height": plot.height,
      "fill": "none",
      "pointer-events": "all"
    }).call(d3.behavior.zoom().x(plot.scales.x).y(plot.scales.y).scaleExtent([1, Infinity]).on("zoom", function() {
      return redraw();
    }));
    redraw = function() {
      plot.select(".x.axis").call(plot.axes.x);
      plot.select(".y.axis").call(plot.axes.y);
      return g_points.attr("transform", transform_points);
    };
  }

  transform_points = function(d) {
    return "translate(" + (plot.scales.x(d.x) + plot.jitters.x()) + ", " + (plot.scales.y(d.y) + plot.jitters.y()) + ")";
  };

  g_points = clip.selectAll(".point").data(plot.data).enter().append("g").attr({
    "class": "point",
    "transform": transform_points
  });

  points = g_points.append("svg:circle").attr({
    "r": function(d) {
      return d.radius;
    },
    "id": function(d, i) {
      return "point-" + i;
    },
    "fill": function(d) {
      return color_scale(d.color_group);
    },
    "stroke": "black",
    "stroke-width": stroke_width,
    "opacity": function(d, i) {
      return opacity;
    },
    "title": tooltip_content
  }).on('mouseover', function(d, i) {
    var point;
    d3.select(this.parentNode).classed("hover", true);
    point = d3.select('circle#point-' + i);
    return tip.show(point.datum(), point.node());
  }).on('mouseout', function(d, i) {
    d3.select(this.parentNode).classed("hover", false);
    return tip.hide();
  });

  point_names = g_points.append("text").text(function(d) {
    return d.point_name;
  }).attr({
    "dy": ".32em",
    "dx": function(d) {
      return 8 + d.radius;
    },
    "text-anchor": "left",
    "opacity": function(d, i) {
      return opacity;
    },
    "display": "none"
  }).style({
    "fill": function(d) {
      return color_scale(d.color_group);
    },
    "font-size": "22px"
  }).on('mouseover', function(d, i) {
    var point;
    d3.select(this.parentNode).classed("hover", true);
    point = d3.select('circle#point-' + i);
    return tip.show(point.datum(), point.node());
  }).on('mouseout', function(d, i) {
    d3.select(this.parentNode).classed("hover", false);
    return tip.hide();
  });

  tip = d3.tip().attr('class', 'd3-tip').offset([-15, 0]).html(tooltip_content);

  clip.call(tip);

  if (show_sidebar) {
    sidebar = plot.right_region.append("g").attr("transform", "translate(60,0)");
    g_toggle_names = sidebar.append("g").style("cursor", "pointer").style("font-size", "22px").on("click", function() {
      return toggle_names();
    });
    g_toggle_names.append("circle").attr("r", 7).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "white");
    g_toggle_names.append("text").attr('text-anchor', 'start').attr('dy', '.32em').attr('dx', '12').text("Show names (" + plot.data.length + ")");
    toggle_names = function() {
      var showing_names;
      showing_names = g_toggle_names.classed("show_names");
      point_names.attr("display", function() {
        if (showing_names) {
          return "none";
        } else {
          return "inline";
        }
      });
      return g_toggle_names.attr("class", function() {
        if (showing_names) {
          return "";
        } else {
          return "show_names";
        }
      }).select("circle").attr("fill", function() {
        if (showing_names) {
          return "white";
        } else {
          return "black";
        }
      });
    };
    if (color_scale.range().length > 1) {
      g_color_title = sidebar.append("text").attr({
        "x": -static_radius,
        "y": distance_between_show_names_and_color_groups,
        "dy": ".35em"
      });
      g_color_title.append("tspan").style({
        "font-size": "16px",
        "font-weight": "bold"
      }).text(plot.color_title);
      if (color_scale.range().length > 2) {
        single_group = g_color_title.append("tspan").attr({
          "fill": "#949494",
          "dx": "20px"
        }).style({
          "font-size": "16px",
          "font-weight": "bold"
        }).text("Show one").on("click", function() {
          return deselect_color_groups();
        });
      }
      g_color_group_keys = sidebar.selectAll(".color_group_key").data(color_scale.domain().reverse()).enter().append("g").attr({
        "transform": function(d, i) {
          return "translate(0, " + (i * (static_radius * 2 + 15) + distance_between_show_names_and_color_groups + 30) + ")";
        },
        "class": "color_group_key"
      }).style("cursor", "pointer");
      g_color_group_keys.append("circle").attr({
        "r": static_radius,
        "fill": color_scale
      }).on("click", function(d) {
        return toggle_points(d);
      });
      g_color_group_keys.append("text").attr({
        "x": static_radius + 10,
        "y": 0,
        "dy": ".35em"
      }).text(function(d) {
        return "" + d + " (" + color_legend_counts[d] + ")";
      }).on("click", function(d) {
        return toggle_points(d);
      });
    }
  }

  show_all_colors = function() {
    g_points.classed("hide", false);
    g_color_group_keys.classed("hide", false);
    return single_group.text("Show one");
  };

  toggle_points = function(color_groups) {
    g_points.filter(function(d) {
      return d.color_group === color_groups;
    }).classed("hide", function() {
      return !d3.select(this).classed("hide");
    });
    g_color_group_keys.filter(function(d) {
      return d === color_groups;
    }).classed("hide", function() {
      return !d3.select(this).classed("hide");
    });
    color_groups = g_points.filter(":not(.hide)").data().map(function(d) {
      return d.color_group;
    }).unique();
    if (color_groups.length === 0) {
      return show_all_colors();
    } else if (color_groups.length === 1) {
      return single_group.text("Show all");
    } else {
      return single_group.text("Show one");
    }
  };

  deselect_color_groups = function() {
    var color_groups, visible_color_groups, visible_points;
    visible_points = g_points.filter(":not(.hide)");
    color_groups = visible_points.data().map(function(d) {
      return d.color_group;
    }).unique();
    if (single_group.text() === "Show one") {
      visible_color_groups = color_groups.reverse()[0];
      g_points.filter(function(d) {
        return d.color_group !== visible_color_groups;
      }).classed("hide", true);
      g_color_group_keys.filter(function(d) {
        return d !== visible_color_groups;
      }).classed("hide", true);
      return single_group.text("Show all");
    } else {
      return show_all_colors();
    }
  };

  d3.select(".g-search").style({
    "top": "" + (g_toggle_names.node().getBoundingClientRect().top + distance_between_show_names_and_color_groups / 2) + "px",
    "left": "" + (g_toggle_names.node().getBoundingClientRect().left) + "px"
  });

  keyuped = function() {
    if (d3.event.keyCode === 27) {
      this.value = "";
    }
    return search(this.value.trim());
  };

  search = function(value) {
    var matches, re;
    if (value) {
      re = new RegExp("" + (d3.requote(value)), "i");
      clip.classed("g-searching", true);
      if (sidebar.selectAll(".color_group_key").size() > 0) {
        g_color_group_keys.classed("hide", false);
        g_points.classed("hide", false);
      }
      g_points.classed("g-match", function(d) {
        return re.test(d.point_name);
      });
      matches = d3.selectAll(".g-match");
      if (matches[0].length === 1) {
        mouseover(matches);
      } else {
        mouseout();
      }
      return search_clear.style("display", null);
    } else {
      mouseout();
      clip.classed("g-searching", false);
      g_points.classed("g-match", false);
      return search_clear.style("display", "none");
    }
  };

  mouseover = function(d) {
    return tip.show(d.datum(), d.node());
  };

  mouseout = function() {
    return tip.hide();
  };

  search_input = d3.select(".g-search input").on("keyup", keyuped);

  search_clear = d3.select(".g-search .g-search-clear").on("click", function() {
    search_input.property("value", "");
    return search();
  });

}).call(this);
