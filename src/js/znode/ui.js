$(function(){
  
  // Composition of NodeGraph in ui
  var graph = new NodeGraph();
  
  // Create a new node when clicking on canvas
  // consider moving to NodeGraph
  $("#canvas").mousedown(function(e){
     if (openWin.css("display") == "none"){
       var children = $(e.target).children();
       if (children.length > 0){
         var type = children[0].tagName;
         if (type == "desc" || type == "SPAN"){
           graph.addNodeAtMouse();
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
    $.post("json/save.php", {data:graph.toJSON(), name:name}, function(data){
      alert("Your file was saved.");
    });
  }
  
  // Open window
  var openWin = $("#openWin");
  // Hide Open at startup
  openWin.hide();
  // Hide when clicking elsewhere
  $("#canvas").mousedown(function(){
    openWin.fadeOut();
  });
  // Show when clicking Open button
  $("#open").click(function(){
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    openWin.fadeIn();
    fileList.load("json/files.php?"+Math.random()*1000000);
  });
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
  
  $(".file").live('click', function() {
    var name = $(this).text();
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
       graph.fromJSON(data);
       
       filename.val(name);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  // Clear All button
  $("#clear").click(function(){
  	if (confirm("Clear all contents?")) {
    	graph.clearAll();
  	}
  });
  
  // Help button
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  
  // Globals button
  // TODO add globals functionality
  $("#globals").click(function(){
    confirm("This will toggle the global variables view.");
  });
  
  // Resources button
  // TODO add resources functionality
  $("#resources").click(function(){
    confirm("This will toggle the resources view.");
  });
});