define([
		'jquery', 
		'backbone',
		'underscore',
		'text!templates/todocontainertemplate.html',
		'text!templates/todoitemtemplate.html',
		'models/todo',
		'collections/todocollection',
		'modules/loadingspinner',
		'modules/formhelper',
		'bootstrap',
		'bootstrapValidator',
		'jqueryui'],
function($, Backbone, _, todocontainertemplate, todoitemtemplate, TodoModel, ToDoCollection, loadingspinner, formhelper){
	var ToDoContainerView = Backbone.View.extend({
		el: '#main',
		//Define error messages happening within this view.
		
		templatecontainer: _.template(todocontainertemplate),
		events: {
			'click #newtodobtn': 'addTodo',
			'keypress .edit-todo': 'getNewDesc',
			'click [type="checkbox"]': 'getCheckedTodo',
			'click #markallcomplete': 'markall',
			'click #markallincomplete': 'markall',
			'click #showallcomplete': 'showall',
			'click #showallincomplete': 'showall',
			'click #showall': 'showall',
			'click .viewtodo': 'viewtodo',
			'click #logout': 'logout',
		},

		initialize: function(){
			this.collection = new ToDoCollection();
			$(function(){
				$('input').keyup(function(e){
				   if(e.keyCode == 13){
				      $(this).trigger('enter');
				   }
				 });
			});
		},
		//Main view rendering function
		render: function(){
			$(this.el).empty();
			$(this.el).append( this.templatecontainer);
			var self = this;
			//Once the main container view is rendered, we will render the collection view
			this.collection.url = "http://recruiting-api.nextcapital.com/users/"+localStorage.uid+"/todos";
			this.collection.fetch({
				data:{'user_id':localStorage.uid, 'api_token':localStorage.atok},
				success: function(collection, response, options){
					self.renderTodoItems(collection);
					$("#todos").sortable();
					$("#todos").disableSelection();
					formhelper.updateCompletedCount(collection, true);
				}
			});
		},
		//Function to render collection of todo models.
		renderTodoItems: function(collection){
			var template = _.template(todoitemtemplate, {'collection': collection.toJSON()});
	        $("#todos").html(template);
		},

		//Function for adding a new todo
		addTodo: function(e){
			e.preventDefault();
			//after adding the new todo, sync the new collection
			var description = _.escape($("#newtodo").val());
			if(description.trim().length===0){
				return false;
			}
			var todo = {'description':description};
			var newtodo = new TodoModel();
			newtodo.url = "http://recruiting-api.nextcapital.com/users/"+localStorage.uid+"/todos";
			this.collection.add(newtodo);
			newtodo.save({'user_id':localStorage.uid, 'api_token':localStorage.atok, 'todo':todo},{
				success:function(model,response){
					//Clear the form field for the next item.
					formhelper.clearfield("#newtodo");
					//Saves the response object into the model in the collection.
					newtodo.set(response);
				}
			});	
		},
		//Function to get the updated description for a todo.
		getNewDesc: function(e){
			if (e.keyCode == 13){
				var currentTarget = $(e.currentTarget);
				var todo = this.collection.get(currentTarget.data('id'));
				var updated_description = _.escape(currentTarget.val());
				todo.set('description',updated_description);
				var desc = {'description': updated_description, 'is_complete':todo.get('is_complete')};
				this.updateTodo(todo, desc, currentTarget.data('id'));
			}
		},
		//Function to mark a todo as checked
		getCheckedTodo: function(e){
			var currentTarget = $(e.currentTarget);
			var todo = this.collection.get(currentTarget.data('id'));
			var is_completed = currentTarget.is(':checked');
			todo.set('is_complete', is_completed);
			var desc = {'description': todo.get('description'),'is_complete':is_completed};
			this.updateTodo(todo, desc, currentTarget.data('id'));
		},
		//Function to mark all todos as complete or incomplete.
		markall: function(e){
			e.preventDefault();
			var markboolean = $(e.currentTarget).data('completeflag');
			var self = this;
			this.collection.invoke('set',{'is_complete':markboolean});
			_(this.collection.models).each(function(todo){
				var desc = {'description':todo.get('description'), 'is_complete':markboolean};
				self.updateTodo(todo, desc, todo.get('id'));
			});
		},
		//Function to update todo model. Handles PUT requests
		updateTodo: function(todo, desc, id){
			todo.url = "http://recruiting-api.nextcapital.com/users/"+localStorage.uid+"/todos/"+id;
			todo.save({'user_id':localStorage.uid, 'api_token':localStorage.atok, 'todo':desc});
		},
		//Function to filter collection of todos based on complete/incomplete and render them.
		showall: function(e){
			e.preventDefault();
			var showallflag = $(e.currentTarget).data('showallflag');
			//Show all todos.
			if(showallflag == undefined){
				this.renderTodoItems(this.collection);
				formhelper.updateCompletedCount(this.collection, true);
			}
			//Show todos based on data attribute which filters the todos(true = show all completed, false = show all incomplete)
			else{
				var result = this.collection.where({'is_complete':showallflag});
				var collection = new ToDoCollection(result);
				this.renderTodoItems(collection);
				if(showallflag == false){
					formhelper.updateCompletedCount(this.collection, false);
				}
				else{
					formhelper.updateCompletedCount(this.collection, true);
				}	
			}
		},
		//Function to view a particular todo description in detail
		viewtodo: function(e){
			e.preventDefault();
			var currentid = $(e.currentTarget).data('id');
			$('#modal-main-content').html(_.escape(this.collection.get(currentid).get('description')));
			$('#myModal').modal('show');
		},

		logout: function(e){
			e.preventDefault();	
			var post_data = {'api_token': localStorage.atok, 'user_id': localStorage.uid};
			$.ajax({
	            type:'DELETE',
	            url: 'http://recruiting-api.nextcapital.com/users/sign_out',
	            dataType: "text/plain",
	            contentType:"application/json",
	            data: JSON.stringify(post_data),
	            success: function (response) {
	            	localStorage.clear();
	            	window.location.hash = '';
	            }
	        });
		},
	});	
	return new ToDoContainerView();
});