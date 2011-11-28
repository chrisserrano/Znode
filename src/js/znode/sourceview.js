function SourceView(){
  var win = $(window);
  var view = $("#sourceView");
  
  $(function() {
  	$("#sourceBox").load("lorem.html");
  });
  $(function() {
  	$("#sourceBox").next().load("lorem.html");
  });
  $(function() {
  	$("#sourceBox").next().next().load("lorem.html");
  });
}