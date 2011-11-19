function ClassGraph(){
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
  
  // default workspace dimensions
  var workspaceWidth = 1000;  
  var workspaceHeight = 1000;
  var paper = new Raphael("classCanvas", workspaceWidth, workspaceHeight);
  
  // Resizing of the canvas
  //function resizePaper(){
    //paper.setSize(win.width(), win.height() - topHeight);
  //}
  //win.resize(resizePaper);
  //resizePaper();
  
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
    
    if (creatingNewNode) currentNode.txt[0].focus();
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
              "top" : 0, "left": 2, "cursor": "pointer",
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
    
	// Add info (i) button
	n.append("<div class='info'>i<\/div>");
	var info = $(".node .info").last();
	info.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
	        "color" : "white", "font-family" : "serif",
	        "top" : 0, "right": 2, "cursor": "pointer",
	        "font-size" : "12px", "background-color" : "#333", "z-index" : 100});
	info.hover(function(){
	  info.css("color","black");
	}, function(){
	  info.css("color","white");
	}).click(function(){
	  confirm("Info button will reveal more class details (composition & function call views)")
	  // TODO info button functionality
	});
	
	// Add class name
   	n.append("<textarea class='className' spellcheck='false'>Class Name</textarea>");
    var className = $(".node .className").last();
    className.css("position","absolute");
    className.css({"width" : nodeWidth,
             "height" : "15px",
             "background-color" : "#AAA", 
             "padding" : "0", "margin": "0", "border": "none",
             "resize" : "none", "overflow" : "hidden",
             "font-size" : "13px", "font-family" : "courier", "font-weight":"bold",
             "text-align" : "center", "border-bottom": "1px solid black",
             "z-index":6});
    this.className = className;
    
    // Add attributes list
   	// TODO Add ability to add/remove functions
   	n.append("<textarea class='attribs' spellcheck='false'>List functions, variables, etc.</textarea>");
    var attribs = $(".node .attribs").last();
    attribs.css("position","absolute");
    attribs.css({"width" : nodeWidth,
             "height" : "30px",
             "background-color" : "#DDD",
             "top" : bar.height() + className.height(),
             "padding" : "0", "margin": "0", "border": "none",
             "resize" : "none", "overflow" : "hidden",
             "font-size" : "12px" , "font-family" : "courier",
             "border-bottom": "1px solid black",
             "z-index":5});
    this.attribs = attribs;
   	
   	// Add text area (source code)
    n.append("<textarea class='txt' spellcheck='false'>Source code</textarea>");
    var txt = $(".node .txt").last();
    txt.css("position","absolute");
    txt.css({"width" : nodeWidth - 5,
             "height" : nodeHeight - bar.height() - className.height() - attribs.height() - 5,
             "top" : bar.height() + className.height() + attribs.height(),
             "resize" : "none", "overflow" : "hidden",
             "font-size" : "12px" , "font-family" : "courier",
             "border" : "none","z-index":4});
    this.txt = txt;
    
    // Add resizer
    n.append("<div class='resizer' />");
    var resizer = $(".node .resizer").last();
    resizer.css({"position" : "absolute" , "z-index" : 10,
                 "width" : "0px", "height" : "0px",
                 "left" : nodeWidth - 11, "top" : nodeHeight - 11,
                 "background-color" : "white", "font-size" : "1px",
                 "border-style" : "solid",
                 "border-width" : "5px",
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
    
    setupConnection(left);
    setupConnection(right);
    setupConnection(top);
    setupConnection(bottom);
    
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
      startDrag(resizer, {left : 100, top : 100, right : 500, bottom : 500},
      function(){
        var loc = resizer.position();
        var x = loc.left;
        var y = loc.top;
        // Replaced resizer.width() & resizer.height() with constant 10
        // since resizer now has 0 width & height but 5px borders
        n.css({"width" : x + 10 + 1,
               "height" : y + 10 + 1});
        className.css({"width" : n.width()});
        attribs.css({"width" : n.width()});
        txt.css({"width" : n.width() - 5, "height" : n.height() - bar.height() - className.height() - attribs.height() - 5});
        
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
      startDrag(n, {left : 10, top: 40, right : workspaceWidth - n.width() - 10, bottom : workspaceHeight - n.height() - 10},
      updateConnections);
    });
    
    // Put box on top on mouse over
    n.mouseenter(function(){
      n.css("z-index", zindex++);
    });
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
  
  var defaultNodeWidth = 200;
  var defaultNodeHeight = 150;
  
  this.addNodeAtMouse = function(){
    //alert("Zevan");
    var w = currentNode.width() || defaultNodeWidth;
    var h = currentNode.height () || defaultNodeHeight;
    var temp = new Node(mouseX - 10, mouseY + 30, w, h);
    currentNode = temp;
    currentConnection = null;
  }
  
  function defaultNode(){
    var temp = new Node(win.width() / 2 - defaultNodeWidth / 2, 
                        win.height() / 2 - defaultNodeHeight / 2,
                        defaultNodeWidth, defaultNodeHeight, true);
    temp.txt[0].focus();
    currentNode = temp;
  }
  defaultNode();

  // load JSON file
  this.fromJSON = function(data){
    clear();
    for (var i in data.nodes){
      var n = data.nodes[i];
      var ex = (i == "0") ? true : false;
      var temp = new Node(n.x, n.y, n.width, n.height, ex, n.id);
      var addreturns = n.txt.replace(/\\n/g,'\n');
      temp.txt.val(addreturns);
      addreturns = n.className.replace(/\\n/g,'\n');
      temp.className.val(addreturns);
      addreturns = n.attribs.replace(/\\n/g,'\n');
      temp.attribs.val(addreturns);
    }
    for (i in data.connections){
      var c = data.connections[i];
      createConnection(nodes[c.nodeA], c.conA, nodes[c.nodeB], c.conB);
    }
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
      json += '"height" : ' + n.height() + ', ';
      json += '"txt" : "' + addSlashes(n.txt.val()) + '", ';
      json += '"className" : "' + addSlashes(n.className.val()) + '", ';
      json += '"attribs" : "' + addSlashes(n.attribs.val()) + '"},';
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
    str = str.replace(/\\/g,'\\\\');
    str = str.replace(/\'/g,'\\\'');
    str = str.replace(/\"/g,'\\"');
    str = str.replace(/\0/g,'\\0');
    str = str.replace(/\n/g,'\\\\n');
    return str;
  }
}