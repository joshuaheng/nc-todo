// This set's up the module paths for underscore and backbone
require.config({ 
    'paths': {
    	"jquery" : "libs/jquery-1.11.1.min",
		"underscore": "libs/underscore-min", 
		"backbone": "libs/backbone-min",
		"bootstrap": "libs/bootstrap.min",
		"bootstrapValidator": "libs/bootstrapValidator",
		"spinner": "libs/spinner.min",
		"jqueryui": "libs/jquery-ui.min",
		"modernizr": "libs/modernizr-latest",
	},
	'shim': 
	{
		backbone: {
			'deps': ['jquery', 'underscore'],
			'exports': 'Backbone'
		},
		underscore: {
			'exports': '_'
		},
		bootstrap:{
			'deps': ['jquery'],
		},
		bootstrapValidator:{
			'deps': ['jquery', 'bootstrap'],
		},
		spinner:{
			'deps': ['jquery'],
		},
		jqueryui:{
			'deps': ['jquery'],
		}
	}	
}); 

require([
	'underscore',
	'backbone',
	'app',
	'modernizr',
	], 
	function(_, Backbone, app, modernizr){
		app.init();
});
