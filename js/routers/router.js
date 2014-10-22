define([
	'jquery', 
	'backbone', 
	'underscore', 
	'views/loginview',
	'views/signupview',
	'views/todocontainerview'], 
function($, Backbone, _, LoginView, SignupView, ToDoContainerView){
	var Router = Backbone.Router.extend({
		initialize: function(){
			this.LoginView = LoginView;
			this.SignupView = SignupView;
			this.ToDoContainerView = ToDoContainerView;
			Backbone.history.start();
		},
		routes: {
			'': 'home',
			'signup':'signup',
			'todos':'todos',
		},
		home: function(){
			if(localStorage.uid != undefined){
				window.location.hash = 'todos';
			}
			else{
				this.LoginView.render();
			}
		},
		signup: function(){
			if(localStorage.uid != undefined){
				window.location.hash = 'todos';
			}
			else{
				this.SignupView.render();
			}
		},
		todos: function(){
			//Detects if a user is logged in. If not, redirect to login page
			if(localStorage.uid == undefined){
				window.location.hash = '';
			}
			else{
				this.ToDoContainerView.render();
			}
		}
	});
	
	return Router;
});
