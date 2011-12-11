function SourceView(){
  var win = $(window);
  var canvas = $("#classCanvas");
  var overlay = $("#overlay");
  var currentNode;
  var currentConnection = {};
  var connections = {};
  var connectionId = 0;
  var newNode;
  var nodes = {};
  var nodeId = 0;
  var mouseX = 0, mouseY = 0;
  var loops = [];
  var pathEnd = {};
  var zindex = 1;
  var hitConnect;
  var key = {};
  var SHIFT = 16;
  var topHeight = $("#controls").height();
  var classList = $("#classListSrc");
  var opacScale = 0.7;
  
  // Data structure
  var dataObj = new Data();
  this.dataObj = dataObj;
  
  // Hide class selection box
  classList.hide();
  
  var paper = new Raphael("classCanvas", "100", "100");
  
  // Resizing of the canvas
  function resizePaper(){
    paper.setSize(win.width(), win.height() - topHeight);
  }
  win.resize(resizePaper);
  resizePaper();
  
  canvas.append("<ul id='menu'><li>Left<\/li><li>Right<\/li><li>Top<\/li><li>Bottom<\/li><\/ul>");
  var menu = $("#menu");
  menu.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 5000, "border" : "1px solid gray", "padding" : 0});
  menu.hide();
  
  canvas.append("<div id='hit' />");
  hitConnect = $("#hit");
  hitConnect.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 4000, "border" : "none", 
                  "width" : 10, "height": 10, "cursor":"pointer", "font-size": "1px"});
                  
  $("#menu li").hover(function(){
    $(this).css("background-color", "#cccccc");
  },
  function(){
    $(this).css("background-color", "white");
  }).click(function(){
    menu.hide();
    var dir = $(this).text();
    connectNode(dir);
  });
  
  function connectNode(dir){
    var node, x, y;
    dir = dir.toLowerCase();
      
    if (dir == "left"){
      x = pathEnd.x + 5;
      y = pathEnd.y - currentNode.height() / 2;
    }else if (dir == "right"){
      x = pathEnd.x - currentNode.width() - 5;
      y = pathEnd.y - currentNode.height() / 2;
    }else if (dir == "top"){
      x = pathEnd.x - currentNode.width() / 2;
      y = pathEnd.y + 5;
    }else if (dir == "bottom"){
      x = pathEnd.x - currentNode.width() / 2;
      y = pathEnd.y - 5 - currentNode.height();
    }
    
    node = new Node(x, y, currentNode.width(), currentNode.height());
    saveConnection(node, dir);
    currentNode = node;
  }
  
  function createConnection(a, conA, b, conB){
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      link.parent = a[conA];
      
      a.addConnection(link);
      currentConnection = link;
      currentNode = a;
      saveConnection(b, conB);
  }
  
  function saveConnection(node, dir){
    if (!currentConnection) return;
    if (!currentConnection.parent) return;
    
    currentConnection.startNode = currentNode;
    currentConnection.endNode = node;
    currentConnection.startConnection = currentConnection.parent;
    currentConnection.endConnection = node[dir.toLowerCase()];
    
    currentConnection.id = connectionId;
    connections[connectionId] = currentConnection;
    connectionId++;
    
    currentNode.updateConnections();
    node.addConnection(currentConnection);
    
    $(currentConnection.node).mouseenter(function(){
      this.raphael.attr("stroke","#FF0000");
    }).mouseleave(function(){
      this.raphael.attr("stroke","#000000");
    }).click(function(){
      if (confirm("Are you sure you want to delete this connection?")){
        this.raphael.remove();
        delete connections[this.raphael.id];
      }
    });
  }
  
  canvas.mousedown(function(e){
    if (menu.css("display") == "block"){
      if (e.target.tagName != "LI"){
        menu.hide();
        currentConnection.remove();
      }
    }
  });
  
  $(document).keydown(function(e){
    key[e.keyCode] = true;
  }).keyup(function(e){
    key[e.keyCode] = false;
  });
  
  $(document).mousemove(function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
  }).mouseup(function(e){
    overlay.hide();
    var creatingNewNode = newNode;
    
    hitConnect.css({"left":mouseX - 5, "top":mouseY + topHeight - 5});
    for (var i in nodes){
      if (nodes[i]){
        var n = nodes[i];
        if (n != currentNode){
          var nLoc = n.content.position();
          if (hitTest(toGlobal(nLoc, n.left), hitConnect)){
            saveConnection(n, "left");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.top), hitConnect)){
            saveConnection(n, "top");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.right), hitConnect)){
            saveConnection(n, "right");
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.bottom), hitConnect)){
            saveConnection(n, "bottom");
            newNode = false;
            break;
          }
        }
      }
    }
    hitConnect.css("left", "-100px");
    
    if (newNode){
      if (key[SHIFT]){
        menu.css({"left":mouseX - 10, "top":mouseY});
        menu.show();
      }else{
        var dir;
        var currDir = currentConnection.parent.attr("class");
        if (currDir == "left"){
          dir = "right";
        }else if (currDir == "right"){
          dir = "left";
        }else if (currDir == "top"){
          dir = "bottom";
        }else if (currDir == "bottom"){
          dir = "top";
        }
        
        if (pathEnd.x == undefined || pathEnd.y == undefined){
          currentConnection.remove();
        }else{
          connectNode(dir);
        }
      }
    }
    newNode = false;
    
    for (var i in loops){
      clearInterval(loops[i]);
    }
    try{
      if (loops.length > 0) document.selection.empty();
    }catch(e){}
    loops = [];
    
    if (creatingNewNode) currentNode.sourceCode[0].focus();
  });
  
  function toGlobal(np, c){
    var l = c.position();
    return {position : function(){ return {left: l.left + np.left, top : l.top + np.top}; },
            width : function(){ return c.width(); },
            height : function(){ return c.height(); }};
  }
  
  function showOverlay(){
    overlay.show();
    overlay.css({"width" : win.width(), "height" : win.height()}); //, "opacity": 0.1});
  }
  
  function startDrag(element, bounds, dragCallback){
    showOverlay();
    var startX = mouseX - element.position().left;
    var startY = mouseY - element.position().top;
    if (!dragCallback) dragCallback = function(){};
      var id = setInterval(function(){
      var x = mouseX - startX;
      var y = mouseY - startY;
      if (bounds){
        if (x < bounds.left) x = bounds.left;
        if (x > bounds.right) x = bounds.right;
        if (y < bounds.top) y = bounds.top;
        if (y > bounds.bottom) y = bounds.bottom;
      }
      element.css("left", x).css("top",y);
      
      // set opacity needs to be duplicated here since function call doesn't work
      var opac = 1 - Math.pow((element.position().left / win.width()), 2);
	  opac += 1 - Math.pow(((win.width()-element.position().left-element.width()) / win.width()), 2);
	  opac = opac*opacScale;
	  element.css("opacity", opac);
	  
      dragCallback();
    },topHeight);
    loops.push(id);
  }
  
  function startScroll(element, dragCallback){
    showOverlay();
    var startX = win.width() / 2;
    if (!dragCallback) dragCallback = function(){};
      var id = setInterval(function(){
      var speedX = startX - mouseX;
      var scale = 0.1;
      var newX = element.position().left - Math.round(speedX*scale);
      
      // reposition
      element.css("left", newX);
      // adjust opacity
      var opac = 1 - Math.pow((element.position().left / win.width()), 2);
      opac += 1 - Math.pow(((win.width()-element.position().left-element.width()) / win.width()), 2);
      opac = opac*opacScale;
      element.css("opacity", opac);
      
      dragCallback();
    },topHeight);
    loops.push(id);
  }
  
  function Node(xp, yp, w, h, noDelete, forceId){
    
    if (forceId){
       nodeId = forceId;
    }
    this.id = nodeId;
    nodes[nodeId] = this;
    nodeId++;
    
    var curr = this;
    this.connections = {};
    var connectionIndex = 0;
    
    this.addConnection = function(c){
      curr.connections[connectionIndex++] = c;
      return c;
    }
    
    canvas.append("<div class='node'/>");
    var n = $(".node").last();
    n.css({"position" : "absolute",      
           "left" : xp, "top" : yp,
           "width" : w, "height" : h,   
           "border" : "1px solid black",
           "background-color" : "white",
           "box-shadow" : "0px 2px 5px rgba(0,0,0,0.75)"});
    n.css("z-index", zindex++);
           
    this.content = n;
    
    this.width = function(){
      return n.width();
    }
    this.height = function(){
      return n.height();
    }
    this.x = function(){
      return n.position().left;
    }
    this.y = function(){
      return n.position().top;
    }
         
    var nodeWidth = n.width();
    var nodeHeight = n.height();
    
    // Add top bar
    n.append("<div class='bar'><\/div>");
    var bar = $(".node .bar").last();
    this.bar = bar;
    bar.css({"height" : "15px", 
             "background-color" : "#333",
             "color": "white", "text-align": "center",
             "padding" : "0", "margin": "0",
             "font-size" : "12px", "cursor" : "pointer", "z-index" : 90});
    
    // Add delete (X) button
    if (!noDelete){
      n.append("<div class='ex'>X<\/div>");
      var ex = $(".node .ex").last();
      ex.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
              "color" : "white", "font-family" : "sans-serif",
              "top" : 0, "right": 2, "cursor": "pointer",
              "font-size" : "10px", "background-color" : "#333", "z-index" : 100});
      ex.hover(function(){
        ex.css("color","black");
      }, function(){
        ex.css("color","white");
      }).click(function(){
      
        if (confirm("Are you sure you want to delete this node?")){
          curr.remove();
        }
      });
    }
	
	// Add div for source code
	n.append("<div><textarea class='sourceCode' spellcheck='false'></textarea></div>");
	var sourceCode = $(".node .sourceCode").last();
	this.sourceCode = sourceCode;
	sourceCode.css({
		"resize": "none",
		"width" : n.width() - 12,
		"height" : n.height()-bar.height()-12});
	
	// Add load class button
	n.append("<div class='load'>File:<\/div>");
	var load = $(".node .load").last();
	load.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
	        "color" : "white",
	        "top" : 0, "left": 2, "cursor": "pointer",
	        "font-size" : "12px", "background-color" : "#333", "z-index" : 100});
	load.hover(function(){
	  load.css("color","black");
	}, function(){
	  load.css("color","white");
	}).click(function(){
		loadSource(curr);
	});
	function loadSource(currentNode){
		// Reload class list
		classList.html("<li class='newClass'>New...</li>");
		for (var i in dataObj.classes) {
			classList.append("<li class='existingClass'>"+i+"</li>");
		}
		classList.css({"left": mouseX+10, "top": mouseY-5, "border": "1px solid black"});
		// Show the class list
		classList.fadeIn();
		bar.click(function(){
			classList.hide();
		})
		// Choose class on click
		$("#classListSrc .existingClass").click(function(){
			classList.hide();
			var name = $(this).html();
			curr.bar.html(name);
			var code = dataObj.source[name];
			curr.sourceCode.val(code);
		})
		// Create a new class
		$("#classListSrc .newClass").click(function(){
			classList.hide();
			var name = prompt("Enter a name for the new file:");
			if (name) {
				curr.bar.html(name);
				dataObj.classes[name] = new Object();
			} else {
				alert("This class must be named in order to save.");
			}
		})
	}
	
    // Add resizer
    n.append("<div class='resizer' />");
    var resizer = $(".node .resizer").last();
    resizer.css({"position" : "absolute" , "z-index" : 10,
                 "width" : "0px", "height" : "0px",
                 "left" : nodeWidth - 16, "top" : nodeHeight - 16,
                 "background-color" : "white", "font-size" : "1px",
                 "border-style" : "solid",
                 "border-width" : "7px",
                 "border-color" : "transparent gray gray transparent",
                 "cursor" : "pointer"});
    
    // Add connector boxes to each side
    n.append("<div class='left'>");
    n.append("<div class='top'>");
    n.append("<div class='right'>");
    n.append("<div class='bottom'>");
    
    var left = $(".node .left").last();
    left.css("left","-11px");
    var top = $(".node .top").last();
    top.css("top","-11px");
    var right = $(".node .right").last();
    var bottom = $(".node .bottom").last();
    
    //setupConnection(left);
    //setupConnection(right);
    //setupConnection(top);
    //setupConnection(bottom);
    
    positionLeft();
    positionRight();
    positionTop();
    positionBottom();
    
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    
    function positionLeft(){
      left.css("top", n.height() / 2 - 5);
    }
    function positionRight(){
      right.css("left",n.width() + 1).css("top", n.height() / 2 - 5);
    }
    function positionTop(){
      top.css("left", n.width() / 2 - 5);
    }
    function positionBottom(){
      bottom.css("top",n.height() + 1).css("left", n.width() / 2 - 5);
    }
    
    function setupConnection(div){
      div.css({"position" : "absolute", "width" : "10px", "padding":0,
               "height" : "10px", "background-color" : "rgba(60,60,60,1)",
               "font-size" : "1px", "cursor" : "pointer"});
    }
    
    this.connectionPos = function(conn){
      var loc = conn.position();
      var nLoc = n.position();
      var point = {};
      point.x = nLoc.left + loc.left + 5;
      point.y = nLoc.top + loc.top + 5;
      return point;
    }
    
    function updateConnections(){
       for (var i in curr.connections){
         var c = curr.connections[i];
         if (!c.removed){
           var nodeA = c.startNode.connectionPos(c.startConnection);
           var nodeB = c.endNode.connectionPos(c.endConnection);
           c.attr("path","M " + nodeA.x + " " + nodeA.y + " L " + nodeB.x + " " + nodeB.y);
            
         }
       }
    }
    this.updateConnections = updateConnections;
   
   function addLink(e){
      currentNode = curr;
      e.preventDefault();
      showOverlay();
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      currentConnection = link;
      currentConnection.parent = $(this);
      
      curr.addConnection(link);
      var loc = $(this).position();
      var nLoc = n.position();
      var x = loc.left + nLoc.left + 5;
      var y = loc.top + nLoc.top + 5;
      newNode = true;
      
      var id = setInterval(function(){
        link.attr("path","M " + x + " " + y + " L " + mouseX + " " + mouseY);
        
        pathEnd.x = mouseX;
        pathEnd.y = mouseY;
      }, 30);
      loops.push(id);
   }
   left.mousedown(addLink);
   right.mousedown(addLink);
   top.mousedown(addLink);
   bottom.mousedown(addLink);
   
   // Remove the node
   this.remove = function(){
     for (var i in curr.connections){
       var c = curr.connections[i];
       c.remove();
       delete connections[c.id];
       delete curr.connections[i];
     }
     n.remove();
     delete nodes[this.id];
   }
    
    // Resizer behavior
    resizer.mousedown(function(e){
      currentNode = curr;
      e.preventDefault();
      startDrag(resizer, {left : 100, top : 100, right : 1000, bottom : 1000},
      function(){
        var loc = resizer.position();
        var x = loc.left;
        var y = loc.top;
        // Replaced resizer.width() & resizer.height() with constant 10
        // since resizer now has 0 width & height but 5px borders
        n.css({"width" : x + 16,
               "height" : y + 16});
        sourceCode.css({"width" : n.width() - 12, "height" : n.height()-bar.height()-12});
        
        positionLeft();
        positionRight();
        positionTop();
        positionBottom();
        updateConnections();
      });
    });
    
    // Top bar behavior
    bar.mousedown(function(e){
      currentNode = curr;
      n.css("z-index", zindex++);
      e.preventDefault();
      startDrag(n, {left : -5000, top: 40, right : 5000, bottom : win.height() - n.height() - 10},
      updateConnections);
    });
    
    // Scroll behavior
    $(".scrollPane").mousedown(function(e){
      currentNode = curr;
      n.css("z-index", zindex++);
      e.preventDefault();
      startScroll(n, updateConnections);
    });
    
    // Put box on top on mouse over
    n.mouseenter(function(){
      n.css("z-index", zindex++);
    });
    
    // Set opacity based on position of node
    setOpacity(n);
    function setOpacity(thisNode) {
	    var opac = 1 - Math.pow((thisNode.position().left / win.width()), 2);
	    opac += 1 - Math.pow(((win.width()-thisNode.position().left-thisNode.width()) / win.width()), 2);
	    opac = opac*opacScale;
	    thisNode.css("opacity", opac);
    }
  }
  
  function hitTest(a, b){
    var aPos = a.position();
    var bPos = b.position();
    
    var aLeft = aPos.left;
    var aRight = aPos.left + a.width();
    var aTop = aPos.top;
    var aBottom = aPos.top + a.height();
    
    var bLeft = bPos.left;
    var bRight = bPos.left + b.width();
    var bTop = bPos.top;
    var bBottom = bPos.top + b.height();
    
    // http://tekpool.wordpress.com/2006/10/11/rectangle-intersection-determine-if-two-given-rectangles-intersect-each-other-or-not/
    return !( bLeft > aRight
      || bRight < aLeft
      || bTop > aBottom
      || bBottom < aTop
      );
  }
  
  
  this.changeScroll = function(scrollVal){
  	alert("remove");
  }
  
 function clear(){
    nodeId = 0;
    connectionsId = 0;
    for (var i in nodes){
      nodes[i].remove();
    }
  }
  
  this.clearAll = function(){
    clear();
    defaultNode();
    currentConnection = null;
    currenNode = null;
  }
  
  this.addNode = function(x, y, w, h, noDelete){
    return new Node(x, y, w, h, noDelete);
  }
  
  var defaultNodeWidth = 400;
  var defaultNodeHeight = 600;
  
  this.addNodeAtMouse = function(){
    var w = currentNode.width() || defaultNodeWidth;
    var h = currentNode.height () || defaultNodeHeight;
    var temp = new Node(mouseX, mouseY, w, h);
    currentNode = temp;
    currentConnection = null;
  }
  
  function defaultNode(){
    var temp = new Node(win.width() / 2 - defaultNodeWidth / 2, 
                        win.height() / 2 - defaultNodeHeight / 2,
                        defaultNodeWidth, defaultNodeHeight, false);
    temp.sourceCode[0].focus();
    currentNode = temp;
  }
  defaultNode();
	
  // load JSON file
  this.fromJSON = function(data){
    clear();
    for (var i in data.nodes){
      var n = data.nodes[i];
      //var ex = (i == "0") ? true : false;
      var ex = false;
      var temp = new Node(n.x, n.y, n.width, n.height, ex, n.id);
    }
    for (i in data.connections){
      var c = data.connections[i];
      createConnection(nodes[c.nodeA], c.conA, nodes[c.nodeB], c.conB);
    }
    // reload source code and class names
    this.loadCode();
  }
  
  // save to JSON file
  this.toJSON = function(){
    var json = '{"nodes" : [';
    for (var i in nodes){
      var n = nodes[i];
      json += '{"id" : ' + n.id + ', ';
      json += '"x" : ' + n.x() + ', ';
      json += '"y" : ' + n.y() + ', ';
      json += '"width" : ' + n.width() + ', ';
      json += '"height" : ' + n.height() + '},';
    }
    json = json.substr(0, json.length - 1);
    json += '], "connections" : [';
    
    var hasConnections = false;
    for (i in connections){
      var c = connections[i];
      if (!c.removed){
      json += '{"nodeA" : ' + c.startNode.id + ', ';
      json += '"nodeB" : ' + c.endNode.id + ', ';
      json += '"conA" : "' + c.startConnection.attr("class") + '", ';
      json += '"conB" : "' + c.endConnection.attr("class") + '"},';
      hasConnections = true;
      }
    }
    if (hasConnections){
      json = json.substr(0, json.length - 1);
    }
    json += ']}';
    return json;
  }
  
  // JSON helper function
  function addSlashes(str) {
    str = str.replace(/\"/g,'\\"');
    str = str.replace(/\\/g,'\\\\');
    str = str.replace(/\'/g,'\\\'');
    str = str.replace(/\0/g,'\\0');
    str = str.replace(/\n/g,'\\\\n');
    return str;
  }
  
  // Save the code in the nodes to the dataObj
  this.saveCode = function() {
  	for (var i in nodes){
  		var name = nodes[i].bar.html();
  		// check to see if a class was loaded
  		if (name) {
  			dataObj.source[name] = nodes[i].sourceCode.val();
  			dataObj.nodeIdx[name] = i;
  		}
  	}
  }
  
  // Save the code in the nodes to the dataObj
  this.loadCode = function() {
  	for (var className in dataObj.classes){
  		var idx = dataObj.nodeIdx[className];
  		if(idx!=undefined){
	  		var src = dataObj.source[className];
  			nodes[idx].sourceCode.val(src);
  			nodes[idx].bar.html(className);
  		}
  	}
  }
}