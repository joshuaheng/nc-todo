define([
		'jquery', 
		'backbone',
		'underscore',
		'text!templates/signuptemplate.html',
		'modules/loadingspinner',
		'bootstrap',
		'bootstrapValidator'],
function($, Backbone, _, signuptemplate, loadingspinner){
	var SignupView = Backbone.View.extend({
		el: '#main',
		events: {
			'click #switchtologinbtn': 'switchtologin',
			'click #signupbtn': 'signup',
		},
		initialize: function(){
			this.template = _.template(signuptemplate);
			this.spinner = loadingspinner.init();
		},
		render: function(){
			$(this.el).empty();
			$(this.el).append( this.template );
			//Initialize our validator plugin for our form inputs
			$(function(){
				//Animation effect when signup form is loaded
				$('#signupformcol').addClass('animated flipInY');
				//Hide email taken error message when user focus on email input
				$("#newuseremail").on('focus',function(){
					$("#emailtaken").css("display","none");
				});
				//init validation plugin for sign up form inputs.
				$('#signupform').bootstrapValidator({
		            feedbackIcons: {
		            	required: 'glyphicon glyphicon-asterisk',
		                valid: 'glyphicon glyphicon-ok',
		                invalid: 'glyphicon glyphicon-remove',
		                validating: 'glyphicon glyphicon-refresh'
		            },
		            fields: {
		                email: {
		                    validators: {
		                        emailAddress: {
			                        message: 'The value is not a valid email address'
			                    },
			                    notEmpty: {
			                        message: 'An email address is required!'
			                    },			                    
		                    }
		                },
		                password: {
		                    validators: {
			                    notEmpty: {
			                        message: 'A password is required!'
			                    },
			                    identical: {
			                        field: 'confirmpassword',
			                        message: 'The password and its confirm are not the same'
			                    }
		                    }
		                },
		                confirmpassword: {
		                    validators: {
			                    notEmpty: {
			                        message: 'A password is required!'
			                    },
			                    identical: {
			                        field: 'password',
			                        message: 'The password and its confirm are not the same'
			                    }
		                    }
		                },	             
		            }
		        });
			});
		},
		switchtologin:function(e){
			e.preventDefault();
			window.location.hash = "";
		},

		signup:function(e){
			e.preventDefault();			
			var email = _.escape($("#newuseremail").val());
			var password = _.escape($("#newuserpw").val());
			var confirmpassword = _.escape($("#newusercfmpw").val());
			if((!email || !password || !confirmpassword)||(password!==confirmpassword)){
				return false;
			}
			$("#signupbtn").attr('disabled',true);
			var post_data = {'email':email, 'password':password};
			var target = $('#foo')[0];
			this.spinner.spin(target);
			$.ajax({
	            type: 'POST',
	            url: 'http://recruiting-api.nextcapital.com/users',
	            contentType:"application/json",
	            data: JSON.stringify(post_data),
	            success: function (response) {
	            	$("#foo").html("");
	                localStorage.atok = response.api_token;
	                localStorage.uid = response.id;
	                //load todos view
	                $('#signupformcol').addClass('animated zoomOut');
	                $('#signupformcol').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	                	//load todos view
	                	window.location.hash = "todos";
	                });
	            },
	            error: function (exception) {
	            	$("#signupbtn").attr('disabled',false);
	            	$("#foo").html("");
	            	//Email is been taken
	                //Trigger error on email input box, hide default email address error msg, show email taken error message
	                $('#signupform').bootstrapValidator('updateStatus','email', 'INVALID');
	                $(".help-block").css("display","none");
	                $("#emailtaken").css("display","block");
	               	//Reset password fields
	                $('#signupform').bootstrapValidator('resetField', 'password', true);
	                $('#signupform').bootstrapValidator('resetField', 'confirmpassword', true);
	                return false;
	            }
	        });
		}
	});	
	return new SignupView();
});
