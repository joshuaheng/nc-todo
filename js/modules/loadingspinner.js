//Helper module for loading spinner gif effect

define([
		'jquery', 
		'spinner'],
function($, Spinner){
	var init = function(){
		var opts = {
		  lines: 13, // The number of lines to draw
		  length: 11, // The length of each line
		  width: 4, // The line thickness
		  radius: 9, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: 'white', // #rgb or #rrggbb or array of colors
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: '50%', // Top position relative to parent
		  left: '50%' // Left position relative to parent
		};
		return new Spinner(opts);
	};	
	return {init:init};
});