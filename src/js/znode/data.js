function Data(){
	
	var classes = new Object();
	
	// Function view
	var class1 = new Object;
	var class2 = new Object;
	
	var func1 = new Array("c1","c2");
	var func2 = new Array("c2","c3");
	
	var funcs = new Object();
	
	funcs['func1'] = func1;
	funcs['func2'] = func2;
	
	class1['func1'] = func1;
	class2['func1'] = func1;
	class2['func2'] = func2;
	
	classes['class1'] = class1;
	classes['class2'] = class2;
	
	// Composition view
	var comps = new Object();
	var compFuncs = new Array("f1","f2");
	var compVars = new Array("v1","v2");
	var class1b = new Object();
	class1b.compFuncs = compFuncs;
	class1b.compVars = compVars;
	comps['class1'] = class1b;
	//alert("here");
	/*
	// Inheritence view
	classes['class1'].supers['class1super'].vars = new Array("v1","v2");
	classes['class1'].subs = new Array("sub1","sub2");
	
	// Globals view
	var globals = new Object();
	globals['global1'].initialized = "class1 line 10";
	globals['global1'].declared = "class1 line 11";
	globals['global1'].changes = new Array("c1","c2");
	globals['global1'].used = new Array("c3","c4");
	
	// Resources view
	var resources = new Object();
	resources['resource1'].used = new Array("c1","c2");
	resources['resource1'].url = "./test/resource1.jpg";
	*/
	this.classes = classes;
	this.funcs = funcs;
	this.globals = globals;
	this.resources = resources;
	this.comps = comps;
	
	function addFunc(className,funcName,funcUsed) {
		// TODO
	}
	
	// save to JSON file
	this.save = function(){
		var saveStruct = new Object();
		saveStruct.classes = this.classes;
		saveStruct.funcs = this.funcs;
		//saveStruct.globals = this.globals;
		//saveStruct.resources = this.resources;
		//saveStruct.comps = this.comps;
		var myJSONText = JSON.stringify(saveStruct);
		return myJSONText;
		alert("here");
	}
	
	this.load = function(data){
		this.classes = data.classes;
		this.funcs = data.funcs;
		//TODO...
	}
}