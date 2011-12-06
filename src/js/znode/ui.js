$(function(){
  
  // Source code view
  var sourceView = new SourceView();
  dataObj = sourceView.dataObj;
  // Function call view
  var functionView = new FunctionView(dataObj);
  functionView.reload();
  // Global variables view
  var globalsView = new GlobalsView(dataObj);
  globalsView.reload();
  
  		//scrollpane parts
  		var lastScrollVal = 0;
		var scrollPane = $( ".scroll-pane" ),
			scrollContent = $( ".scroll-content" );
		//build slider
		var scrollbar = $( ".scroll-bar" ).slider({
			slide: function( event, ui ) {
				if ( scrollContent.width() > scrollPane.width() ) {
					// Scroll the canvas
					var scrollVal = Math.round(
						ui.value / 100 * ( scrollPane.width() - scrollContent.width() )) + "px";
					scrollContent.css( "margin-left",  scrollVal);
					// Scroll the nodes
					sourceView.changeScroll(scrollVal);
					lastScrollVal = scrollVal;
				} else {
					scrollContent.css( "margin-left", 0 );
				}
			}
		});
		
		//append icon to handle
		var handleHelper = scrollbar.find( ".ui-slider-handle" )
		.mousedown(function() {
			scrollbar.width( handleHelper.width() );
		})
		.mouseup(function() {
			scrollbar.width( "100%" );
		})
		.append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
		.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
		
		//change overflow to hidden now that slider handles the scrolling
		scrollPane.css( "overflow", "hidden" );
		
		//size scrollbar and handle proportionally to scroll distance
		function sizeScrollbar() {
			var remainder = scrollContent.width() - scrollPane.width();
			var proportion = remainder / scrollContent.width();
			var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
			scrollbar.find( ".ui-slider-handle" ).css({
				width: handleSize,
				"margin-left": -handleSize / 2
			});
			handleHelper.width( "" ).width( scrollbar.width() - handleSize );
		}
		
		//reset slider value based on scroll content position
		function resetValue() {
			var remainder = scrollPane.width() - scrollContent.width();
			var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
				parseInt( scrollContent.css( "margin-left" ) );
			var percentage = Math.round( leftVal / remainder * 100 );
			scrollbar.slider( "value", percentage );
		}
		
		//if the slider is 100% and window gets larger, reveal content
		function reflowContent() {
				var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
				var gap = scrollPane.width() - showing;
				if ( gap > 0 ) {
					scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
				}
		}
		
		//change handle position on window resize
		$( window ).resize(function() {
			resetValue();
			sizeScrollbar();
			reflowContent();
		});
		//init scrollbar size
		setTimeout( sizeScrollbar, 10 );//safari wants a timeout
  
  // Default view is source view
  $("#inheritView,#functionView,#globalsView").hide();
  
  // Create a new node when clicking on canvas
  // Only for inheritance view
  $("#classCanvas").click(function(e){
     if (openWin.css("display") == "none"){
       var children = $(e.target).children();
       if (children.length > 0){
         var type = children[0].tagName;
         if (type == "desc" || type == "SPAN"){
           sourceView.addNodeAtMouse();
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
    // save node positions to JSON
    $.post("json/save.php", {data:sourceView.toJSON(), name:name});
    // save code changes in nodes to data object
    sourceView.saveCode();
    // save everything else
    $.post("json/saveStruct.php", {data:dataObj.save(), name:name});
    alert("Your file was saved.");
  }
  
  // Open window
  var openWin = $("#openWin");
  // Hide Open at startup
  openWin.hide();
  // Hide when clicking elsewhere on the canvasses
  $("#classCanvas,#sourceView,#inheritView,#functionView,#globalsView")
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
    $.getJSON("files/structs/" + name + ".json", function(data){
    	// load JSON file, class info
       	dataObj.load(data);
    });
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
    	// load JSON file, node info
    	sourceView.fromJSON(data);
    });
	// Reload views
	functionView.reload();
	globalsView.reload();
	// update filename box
	filename.val(name);
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  // Clear All button
  $("#clear").click(function(){
  	if (confirm("Clear all contents?")) {
    	sourceView.clearAll();
    	dataObj.clearAll();
    	functionView.reload();
    	globalsView.reload();
  	}
  });
  
  // Help button
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  
  // Inheritance view button
  $("#inheritance").click(function(){
  	$("#inheritView").fadeIn();
  	$("#classCanvas,#functionView,#globalsView").hide();
  });
  
  // Source code view button
  $("#source").click(function(){
  	$("#classCanvas").fadeIn();
  	$("#inheritView,#functionView,#globalsView").hide();
  });
  
  // Function calls view button
  $("#func").click(function(){
  	$("#functionView").fadeIn();
  	$("#inheritView,#classCanvas,#globalsView").hide();
  });
  
  // Globals view
  $("#globals").click(function(){
    $("#globalsView").fadeIn();
  	$("#inheritView,#classCanvas,#functionView").hide();
  });
  
  // Composition view button
  // TODO add resources functionality
  $("#comp").click(function(){
    
  });
  
  // Resources view button
  // TODO add resources functionality
  $("#resources").click(function(){
  	
  });
  
});