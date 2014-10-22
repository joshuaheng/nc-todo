// This is the main entry point for the App
define(['routers/router'], function(router){
	var init = function(){
		this.router = new router();
	};
	return { init: init};
});
