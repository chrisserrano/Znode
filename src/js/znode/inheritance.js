function InheritanceView(dataObj){
	
	var tree = $("#tree");
	
	// A couple tweaks to show the last subclass properly
    $("span").last().css("top", "5px");
    $("span").last().css("left", "-35px");
	
	
	this.reload = function() {
		
		// Clear tree
		tree.html("");
		
		// List class names
		$(".classList").html("List of files in project:");
		for (var i in dataObj.classes) {
			$(".classList").append("<h4>"+i+"</h4>");
		}
		
		// Behovior when selecting a class
		$(".classList h4").click(function(){
			var name = $(this).html();
			
			// Clear tree
			tree.html("");
			
			// Superclass
			var superC = dataObj.supers[name];
			if (superC) {
				tree.append('<div class="super">'+superC.name+'</div>');
    			tree.append('<div class="subSuper"></div>');
			}
			
			// Main class
			tree.append('<div class="mainClass">'+name+'</div>');
			if (superC) {
				$(".mainClass").last().append('<hr>Uses superclass functions:');
				for (var f in superC.funcs) {
					$(".mainClass").last().append('<p>'+superC.funcs[f]+'</p>');
				}
				$(".mainClass").last().append('<hr>Uses superclass variables:');
				for (var v in superC.vars) {
					$(".mainClass").last().append('<p>'+superC.vars[v]+'</p>');
				}
			}
			//<hr>Uses superclass functions:<p>1<hr>Uses superclass variables:<p>2</div>');
			
			// Subclasses
			var subs = dataObj.subs[name];
			for (var sub in subs) {
				tree.append('<div class="subL"></div>');
		    	tree.append('<div class="subStraight"></div>');
			    tree.append('<div class="sub"><span>'+subs[sub]+'</span></div>')
			}
			// Remove extra straight line
			$(".subStraight").last().remove();
			
			// A couple tweaks to show the last subclass properly
		    $("span").last().css("top", "5px");
		    $("span").last().css("left", "-35px");
		})
	}
}