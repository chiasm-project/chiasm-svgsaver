var ChiasmComponent = require("chiasm-component"),
  SvgSaver = require("svgsaver"),
  d3 = require("d3");

// This function defines a Chiasm component that draws a colored rectangle using D3.js.
function DownloadButton() {

  // Construct a Chiasm component instance,
  // specifying default values for public properties.
  var my = new ChiasmComponent({

    // The color of the rectangle, a CSS color string.
    color: "white",
    text: "Download SVG",
    downloadAs: "SVG"

  });

  var svgsaver = new SvgSaver();

  // Initialize an SVG Group element for containing this component.
  var _g = my.initSVG();
  var g = d3.select(_g);

  g.style('cursor', 'pointer');

  // Add a background rectangle to the SVG Group element using D3.
  var rect = g.append("rect");
  var label = g.append('text')
    .attr("text-anchor", "middle");

  // Set the rectangle color to be the configured color.
  my.when("color", function (color){
    rect.attr("fill", color);
  });

  my.when("text", function (text){
    label.text(text);
  });

  // Respond to dynamic width and height.
  // "box" is a special property set by chiasm-layout.
  my.when("box", function (box) {

    // Set the size of the background rectangle.
    rect
      .attr("width", box.width)
      .attr("height", box.height);

    label
      .attr('x', box.width/2)
      .attr('y', box.height/2);

  });

  // Set up the rectangle so that when you click on it, it downlaods the SVG
  g.on("click", function (){
    if (my.downloadAs === "SVG") {
      svgsaver.asSvg(_g.ownerSVGElement);
    } else {
      svgsaver.asPng(_g.ownerSVGElement);
    }
  });

  return my;
}

module.exports = DownloadButton;
