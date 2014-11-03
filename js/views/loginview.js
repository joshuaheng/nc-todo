define([
		'jquery', 
		'backbone',
		'underscore',
		'text!templates/logintemplate.html',
		'modules/loadingspinner',
		'modules/formhelper',
		'bootstrap',
		'bootstrapValidator'],
function($, Backbone, _, logintemplate, loadingspinner, formhelper){
	var LoginView = Backbone.View.extend({
		el: '#main',

		events: {
			'click #loginbtn': 'login',
			'click #switchtosignupbtn': 'switchtosignup',
		},

		initialize: function(){
			this.template = _.template(logintemplate);
			this.spinner = loadingspinner.init();
		},

		render: function(){
			$(this.el).empty();
			$(this.el).append( this.template );
			$(function(){
				$('#loginformcol').addClass('animated flipInY');
				//Remove the error class and error message when the user focus on the input field
				$("#useremail").on('focus',function(){
					$("#invalidemail").css("display","none");
					$("#invalidemail").parent().removeClass("has-error");
				});
				//Remove the error class and error message when the user focus on the input field
				$("#userpassword").on('focus',function(){
					$("#invalidpassword").css("display","none");
					$("#invalidpassword").parent().removeClass("has-error");
				});
			});
		},

		login:function(e){
			e.preventDefault();
			//Escape user input to prevent XSS attacks
			var email = _.escape($("#useremail").val());
			var password = _.escape($("#userpassword").val());
			if(!email || !password){
				return false;
			}
			//Disable the login btn to prevent multiple ajax calls
			$("#loginbtn").attr('disabled',true);
			var target = $('#foo')[0];
			this.spinner.spin(target);
			var post_data = {'email':email, 'password':password};
			$.ajax({
	            type: 'POST',
	            url: 'http://localhost:3000/users/sign_in',
	            contentType:"application/json",
	            data: JSON.stringify(post_data),
	            success: function (response) {
	            	$("#foo").html("");
	            	//Uses session storage to store the user's api_token and user_id
	                localStorage.atok = response.api_token;
	                localStorage.uid = response.id;
	                $('#loginformcol').addClass('animated zoomOut');
	                $('#loginformcol').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	                	//load todos view
	                	window.location.hash = "todos";
	                });   
	            },
	            error: function (exception) {
	            	//Hides the loading spinner
	            	$('#foo').html("");
	            	$("#loginbtn").attr('disabled',false);
	            	var exception_response = JSON.parse(exception.responseText);
	            	//Highlight the input box that has the wrong input.
	            	if(exception_response.error === "Couldn't find a user with that email."){
	            		formhelper.highlighterror("#invalidemail", exception_response.error);
	            	}
	            	else if(exception_response.error === "Password is not valid."){
	            		formhelper.highlighterror("#invalidpassword", exception_response.error);
	            	}
	                return false;
	            }
	        });
		},

		switchtosignup:function(e){
			e.preventDefault();
			window.location.hash = "signup";	
		}
	});	
	return LoginView;
});
