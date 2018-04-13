var data_nodes;
var data_connections;
var link_from;

d3.csv("x2.csv", function(error, data) {
        if (error) throw error;
        
        data_nodes = data;
        for(var i=0; i<data.length; i++)
        {
            node = data[i]
            d3.select(".level-"+node.level).append("div").append('div').attr('class', 'node').attr("id", 'node-'+node.id).attr('active', 'false').html(node.name)
        }

        $(".node").on('click', function(){drawNodeLinks(this)})


    });


d3.csv("x1.csv", function(error, data) {
    if (error) throw error;

    data_connections = data;
    for(var i=0; i<data.length; i++)
    {
        node = data[i]
        d3.select(".level-0").append("div").append('div').attr('class', 'node-start').attr("id", 'node-0'+i).attr('active', 'false').html(node.name)
    }

    $(".node-start").on('click', function(){drawDataLinks(this)})

});

function drawNodeLinks(e)
{
    $('.path').remove()
    $('.active').removeClass('active')
    $(e).addClass('active')
    var node_data = data_nodes[parseInt(e.getAttribute('id').split("-")[1])]
    var connections = node_data.connections.split(",")
    var scrollTop = $(window).scrollTop();

    var box_1 = e.getBoundingClientRect();
    var x1 = box_1.right;
    var y1 = scrollTop + box_1.top + (box_1.bottom - box_1.top)/2 

    for(var i=0; i<connections.length; i++)
    {   
        var to_node = $('#node-' + connections[i])[0]
        var box_2 = to_node.getBoundingClientRect();
        var x2 = box_2.left;
        var y2 = scrollTop + 0.5*(box_2.top + box_2.bottom)

        var curveData = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
        var edge = d3.select('svg').append('g');
        var diagonal = d3.svg.diagonal()
        .source(function (d) { return { x: d[0].y, y: d[0].x }; })            
        .target(function (d) { return { x: d[1].y, y: d[1].x }; })
        .projection(function (d) { return [d.y, d.x]; });

        d3.select('g')
        .datum(curveData)
        .append('path')
        .attr('class', 'link path')
        .attr('d', diagonal)
    }

    
}


function drawDataLinks(e)
{
    $('.path').remove()
    $('.active').removeClass('active')

    $(e).addClass('active')
    var node_data = data_connections[parseInt(e.getAttribute('id').split('-')[1])]
    var connections = node_data.sequence.split(",")
    var scrollTop = $(window).scrollTop();

    var box_1 = e.getBoundingClientRect();
    var x1 = box_1.right;
    var y1 = scrollTop + box_1.top + (box_1.bottom - box_1.top)/2 

    for(var i=0; i<connections.length; i++)
    {   
        var to_node = $('#node-' + connections[i])[0]
        $(to_node).addClass("active")
        var box_2 = to_node.getBoundingClientRect();
        var x2 = box_2.left;
        var y2 = scrollTop + 0.5*(box_2.top + box_2.bottom)
        var width = box_2.right - box_2.left

        var curveData = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
        var edge = d3.select('svg').append('g');
        var diagonal = d3.svg.diagonal()
        .source(function (d) { return { x: d[0].y, y: d[0].x }; })            
        .target(function (d) { return { x: d[1].y, y: d[1].x }; })
        .projection(function (d) { return [d.y, d.x]; });

        d3.select('g')
        .datum(curveData)
        .append('path')
        .attr('class', 'link path')
        .attr('d', diagonal)

        x1 = x2 + width;
        y1 = y2;
    }
}


function linkFrom(e)
{
    return_value = []
    for(var i=0; i<data_nodes.length; i++)
    {
        if(data_nodes[i].connections.search(e)>0)
        {
            return_value.push(data_nodes[i].id)
        }
    }
    return return_value;
}