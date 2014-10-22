//Helper module for input form
define(['jquery'],
function($){
	var highlighterror = function(error_container_id, error_msg){
		$(error_container_id).html(error_msg);
	    $(error_container_id).css("display","block");
	    $(error_container_id).parent().addClass("has-error");
	};

	var unhighlighterror = function(error_container_id, error_msg){
		$(error_container_id).html(error_msg);
	    $(error_container_id).css("display","block");
	    $(error_container_id).parent().addClass("has-error");
	};

	var clearfield = function(inputid){
		$(inputid).val('');
	};
	//Displays the count of complete or incomplete against the total number of models in the collection
	var updateCompletedCount = function(collection, completionflag){
		if(completionflag==true){
			var completed = collection.where({'is_complete':true}).length;
			$('#totalcompletenum').html("Completed Todos: " + completed.toString()+" / " + collection.length.toString());
		}
		else{
			var completed = collection.where({'is_complete':false}).length;
			$('#totalcompletenum').html("Incomplete Todos : " + completed.toString()+" / " + collection.length.toString());
		}
	}
	return {
		highlighterror:highlighterror,
		unhighlighterror:unhighlighterror,
		clearfield: clearfield,
		updateCompletedCount: updateCompletedCount,
	};
});