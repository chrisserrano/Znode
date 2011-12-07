function Data(){
	
	var source = new Object();
	var nodeIdx = new Object();
	var classes = new Object();
	var funcs = new Object();
	var comps = new Object();
	var globals = new Object();
	var resources = new Object();
	var supers = new Object();
	var subs = new Object();
	
	/* test values */
	// Source view
	var source1 = "example f1 source code f2 ... v1 ... v2 ...";
	var source2 = "example source code 2";
	var source3 = "example source code sub1";
	var source4 = "example source code sub2";
	
	source['class1'] = source1;
	source['class2'] = source2;
	source['sub1'] = source3;
	source['sub2'] = source4;
	
	// Function view
	var class1 = new Object;
	var class2 = new Object;
	
	var func1 = new Array("c1","c2");
	var func2 = new Array("c2","c3");
	
	funcs['func1'] = func1;
	funcs['func2'] = func2;
	
	class1['func1'] = func1;
	class2['func1'] = func1;
	class2['func2'] = func2;
	
	classes['class1'] = class1;
	classes['class2'] = class2;
	
	// Composition view
	var compFuncs = new Array("f1","f2");
	var compVars = new Array("v1","v2");
	var class1b = new Object();
	class1b.compFuncs = compFuncs;
	class1b.compVars = compVars;
	comps['class1'] = class1b;
	
	// Inheritence view
	var class1super = new Object();
	class1super.name = "class1super";
	class1super.funcs = new Array("f1","f2");
	class1super.vars = new Array("v1","v2");
	
	supers['class1'] = class1super;
	
	var class1subs = new Array("sub1","sub2");
	subs['class1'] = class1subs;
	
	// Globals view
	var global1 = new Object();
	global1.init = "class1 line 10";
	global1.declared = "class1 line 11";
	global1.changes = new Array("c1","c2");
	global1.used = new Array("c3","c4");
	globals['global1'] = global1;
	
	// Resources view
	var resource1 = new Object();
	resource1.used = new Array("c1","c2");
	resource1.url = "./test/resource1.jpg";
	resources['resource1'] = resource1;
	/* end test values */
	
	this.source = source;
	this.nodeIdx = nodeIdx;
	this.classes = classes;
	this.funcs = funcs;
	this.globals = globals;
	this.resources = resources;
	this.comps = comps;
	this.supers = supers;
	this.subs = subs;
		
	this.save = function(){
		var saveStruct = new Object();
		saveStruct.source = this.source;
		saveStruct.nodeIdx = this.nodeIdx;
		saveStruct.classes = this.classes;
		saveStruct.funcs = this.funcs;
		saveStruct.globals = this.globals;
		saveStruct.resources = this.resources;
		saveStruct.comps = this.comps;
		saveStruct.supers = this.supers;
		saveStruct.subs = this.subs;
		var myJSONText = JSON.stringify(saveStruct);
		return myJSONText;
	}
	
	this.load = function(data){
		this.source = data.source;
		this.nodeIdx = data.nodeIdx;
		this.classes = data.classes;
		this.funcs = data.funcs;
		this.globals = data.globals;
		this.resources = data.resources;
		this.comps = data.comps;
		this.supers = data.supers;
		this.subs = data.subs;
	}
	
	this.clearAll = function(){
		this.source = new Object();
		this.nodeIdx = new Object(); 
		this.classes = new Object();
		this.funcs = new Object();
		this.globals = new Object();
		this.resources = new Object();
		this.comps = new Object();
		this.supers = new Object();
		this.subs = new Object();
	}
}