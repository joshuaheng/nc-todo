define(['jquery',
		'backbone',
		'underscore', 
		'models/todo',
		'text!templates/todoitemtemplate.html',
		'modules/formhelper',], function($, Backbone, _, Todo, todoitemtemplate, formhelper){
	var TodoCollection = Backbone.Collection.extend({
		model: Todo,
		initialize: function(){
			this.on("change", function(ship) {
			  //Sorts the collection to display most current todos first.
			  this.order = 'id';
			  this.sort();
			  var template = _.template(todoitemtemplate, {'collection': this.toJSON()});
			  $("#todos").html(template);
			  //Updates the completion count whenever there is a change in the collection
			  formhelper.updateCompletedCount(this, true);
			});
		},
		comparator: function(Todo){
			//Returns the collection sorted with the most current todos at the top
			return -Todo.get('id');
		}
	});	
	return TodoCollection;
});