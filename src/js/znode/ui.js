$(function(){
  
  // Inheritance view
  var classGraph = new ClassGraph();
  dataObj = classGraph.dataObj; // localStorage data
  // Source code view
  var sourceView = new SourceView();
  // Function call view
  var functionView = new FunctionView(dataObj);
  functionView.reload();
  
  // Default view is node view
  $("#sourcePop,#sourceView,#functionView,#globalsView").hide();
  
  // JQueryUI Sortable functionality
  $("#sortable").sortable();
  $("#sortable").disableSelection();
  $("#sortableFuncs").sortable();
  
  // Create a new node when clicking on canvas
  // Only for inheritance view
  $("#classCanvas").mousedown(function(e){
     if (openWin.css("display") == "none"){
       var children = $(e.target).children();
       if (children.length > 0){
         var type = children[0].tagName;
         if (type == "desc" || type == "SPAN"){
           classGraph.addNodeAtMouse();
         }
       }
     }
  });
  
  // Behavior for all buttons
  $(".btn").mouseenter(function(){
    $(this).animate({"backgroundColor" : "white"}, 200);
  }).mouseleave(function(){
    $(this).animate({"backgroundColor" : "#efefef"});
  });
  
  // Save button
  $("#save").click(saveFile);
  function saveFile(){
    var name = filename.val();
    if (name == "" || name == nameMessage){
      alert("Please Name Your File");
      filename[0].focus();
      return;
    }
    if (name == "unsaved"){
      alert("Invalid file name: unsaved.  Please choose a different file name.");
      filename[0].focus();
      return;
    }
    // Save to JSON file
    $.post("json/save.php", {data:classGraph.toJSON(), name:name});
    $.post("json/saveStruct.php", {data:dataObj.save(), name:name});
    // Save to MySQL database
    $.post("mySQL/saveFile.php?file="+name, function(data){
      alert("Your file was saved.");
    });
  }
  
  // Open window
  var openWin = $("#openWin");
  // Hide Open at startup
  openWin.hide();
  // Hide when clicking elsewhere on the canvasses
  $("#classCanvas,#sourceView,#functionView,#globalsView")
  .mousedown(function(){
    openWin.fadeOut();
  });
  // Show when clicking Open button
  $("#open").click(function(){
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    openWin.fadeIn();
    fileList.load("json/files.php?"+Math.random()*1000000);
  });
  
  // Enter file name box
  var nameMessage = "Enter your file name";
  var filename = $("#filename").val(nameMessage);
  filename.focus(function(){
    if ($(this).val() == nameMessage){
      $(this).val("");
    }
  }).blur(function(){
    if ($(this).val() == ""){
      $(this).val(nameMessage);
    }
  });
  $("#nameForm").submit(function(e){
    e.preventDefault();
    saveFile();
  });
  
  // Click file to open
  $(".file").live('click', function() {
    var name = $(this).text();
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
    	// load JSON file
    	classGraph.fromJSON(data);
    	// load MySQL table
    	$.post("mySQL/loadFile.php?file="+name);
    	// table data (now copied to "unsaved") can now populate nodes
    	classGraph.fromTable(name);
    	// Load function view list
    	functionView.reload();
    	// update filename box
    	filename.val(name);
    });
    $.getJSON("files/structs/" + name + ".json", function(data){
       	dataObj.load(data);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  // Clear All button
  $("#clear").click(function(){
  	if (confirm("Clear all contents?")) {
    	classGraph.clearAll();
  	}
  });
  
  // Help button
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  
  // Inheritance view button
  $("#inheritance").click(function(){
  	$("#classCanvas").fadeIn();
  	$("#sourceView,#functionView,#globalsView").hide();
  });
  
  // Source code view button
  $("#source").click(function(){
  	$("#sourceView").fadeIn();
  	$("#classCanvas,#functionView,#globalsView").hide();
  });
  
  // Function calls view button
  $("#func").click(function(){
  	$("#functionView").fadeIn();
  	$("#sourceView,#classCanvas,#globalsView").hide();
  });
  
  
  // Globals view
  $("#globals").click(function(){
    $("#globalsView").fadeIn();
  	$("#sourceView,#classCanvas,#functionView").hide();
  });
  
  // Resources button
  // TODO add resources functionality
  $("#resources").click(function(){
    confirm("This will toggle the resources view.");
  });
  
});