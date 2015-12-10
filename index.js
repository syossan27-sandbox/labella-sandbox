var labella = require('labella');
var d3 = require('d3');

// ---------------------------------------------------
// Create dummy data
// ---------------------------------------------------

var nodes = [
  // new labella.Node(idealPosition, width)
  new labella.Node(1,50),
  new labella.Node(2,50),
  new labella.Node(3,50),
  new labella.Node(3,50),
  new labella.Node(3,50),
  new labella.Node(304,50),
  new labella.Node(454,50),
  new labella.Node(454,50),
  new labella.Node(454,50),
  new labella.Node(804,50),
  new labella.Node(804,70),
  new labella.Node(804,50),
  new labella.Node(804,50),
  new labella.Node(854,50),
  new labella.Node(854,50)
];

var options =   {
  margin: {left: 20, right: 20, top: 20, bottom: 20},
  initialWidth: 1000,
  initialHeight: 112
};

var innerWidth =  options.initialWidth - options.margin.left - options.margin.right;
var innerHeight = options.initialHeight - options.margin.top - options.margin.bottom;
var colorScale = d3.scale.category10();

var vis = d3.select('#timeline')
  .append('svg')
    .attr('width',  options.initialWidth)
    .attr('height', options.initialHeight)
  .append('g')
    .attr('transform', 'translate('+options.margin.left+','+options.margin.top+')');

// ---------------------------------------------------
// Draw dots on the timeline
// ---------------------------------------------------

vis.append('line')
  .classed('timeline', true)
  .attr('x2', innerWidth);

var linkLayer = vis.append('g');
var labelLayer = vis.append('g');
var dotLayer = vis.append('g');

dotLayer.selectAll('circle.dot')
  .data(nodes)
.enter().append('circle')
  .classed('dot', true)
  .attr('r', 3)
  .attr('cx', function(d){return d.getRoot().idealPos;});

function color(d,i){
  return colorScale(i);
}

//---------------------------------------------------
// Labella has utility to help rendering
//---------------------------------------------------

var renderer = new labella.Renderer({
  layerGap: 60,
  nodeHeight: 12
});

function draw(nodes){
  // Add x,y,dx,dy to node
  renderer.layout(nodes);

  // Draw label rectangles
  labelLayer.selectAll('rect.flag')
    .data(nodes)
  .enter().append('rect')
    .classed('flag', true)
    .attr('x', function(d){ return d.x - d.dx/2; })
    .attr('y', function(d){ return d.y; })
    .attr('width', function(d){ return d.dx; })
    .attr('height', function(d){ return d.dy; })
    .style('fill', color);

  // Draw path from point on the timeline to the label rectangle
  linkLayer.selectAll('path.link')
    .data(nodes)
  .enter().append('path')
    .classed('link', true)
    .attr('d', function(d){return renderer.generatePath(d);})
    .style('stroke', color)
    .style('stroke-width',2)
    .style('opacity', 0.6)
    .style('fill', 'none');
}

//---------------------------------------------------
// Use labella.Force to place the labels
//---------------------------------------------------

var force = new labella.Force({
  minPos: 0,
  maxPos: 960
});

force
  .nodes(nodes)
  // Listen when the nodes' positions are fully updated.
  .on('end', function(){
    // The rendering is independent from the library.
    // User can use canvas, svg or any library to draw the labels.
    // In this example, the draw() function is defined above
    // using the built-in utility labella.Renderer.
    draw(force.nodes());
  })
  // Run simulation at most 100 rounds. It may end earlier if equillibrium is reached.
  .start(100);
