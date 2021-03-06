﻿$(document).ready(function () {
	
	// activate bootstrap objects
	$('.modal').modal({ show: false });
	$('.collapse').collapse({ toggle: false });

	load_movies();
	load_actors();
	load_directors();
	
	// event handler to open delete dialogue
	$(document).on('click', '.delete-item', function (event) {
		var path = $(this).data('type'); // actors, directors, or movies
		var id = $(this).data('id');
		var grandparent = $(this).parent().parent().parent();
		
		grandparent.find('.alert').remove();
		
		var remove_alert =
			$('<div>', { html: 'This will permananently remove this item from the database. Are you sure?<br><br>' }).addClass('alert alert-warning alert-dismissable fade in').append(
				$('<button>', { type: 'button', 'data-path': path, 'data-id': id }).addClass('btn btn-danger btn-block delete').html("Delete"),
				$('<button>', { type: 'button', 'data-dismiss': 'alert' }).addClass('btn btn-default btn-block').html("Cancel")
		)
		remove_alert.alert();
		grandparent.append(remove_alert);
	});
	
	// event handler to delete database items
	$(document).on('click', '.delete', function (event) {
		var path = $(this).data('path');
		var id = $(this).data('id');
		$.ajax({
			url: "/" + path + "/" + id,
			type: 'DELETE',
			success: function (result){
				switch (path) {
					case "movies":
						load_movies();
						break;
					case "actors":
						load_actors();
						break;
					case "directors":
						load_directors();
						break;
				}
			}
		});
	});
	
	// handle list-building in the create forms
	$('.list-builder').click(function (event) {
		var input_ref = $(this).data('input');
		var list_ref = $(this).data('list');
		// only add to list if there is valid input
		if ($(input_ref).val().trim() !== "") {
			var input_value = $(input_ref).val();
			var list_item = $('<li>', { text: input_value }).append(
					$('<button>', { html: '&times;' }).addClass('btn-delete-list-item btn btn-xs btn-danger')
			);
			// delete any warnings that have been generated
			$(list_ref).find('.alert').remove();
			$(list_ref).append(list_item);
			$(input_ref).val("");
		}
	});
	
	// event handler to delete list-builder items
	$(document).on('click', '.btn-delete-list-item', function (event) { 
		$(this).parent().remove();
	});

	// handle track value updating
	$('input[type="range"]').on('input', function (event) { 
		var display_value = parseFloat($(this).val()).toFixed(1);
		$('span[data-parent="' + $(this).prop('id') + '"').html(display_value);
	});

	// handle add movie form submission
	$('#add_movie_form').submit(function (event) {
		event.preventDefault();
		
		// validate form data
		if ($('#actor_list').is(':empty')) {
			warn('#actor_list', "You must enter at least one actor")
			return;
		}
		if ($('#director_list').is(':empty')) {
			warn('#director_list', "You must enter at least one director")
			return;
		}

		var movie = {
			title: $('#movie_title').val(),
			rating: $('#rating_range').val(),
			description: $('#movie_description').val(),
			release_year: $('#movie_release_year').val(),
			actors: [],
			directors: []
		}
		$('#actor_list').find("li").each(function (index, element) { 
			movie.actors.push($(element).contents()[0].data);
			
		});
		$('#director_list').find("li").each(function (index, element) {
			movie.directors.push($(element).contents()[0].data);
		});
		$.post('/movies', movie, function (response) {
			load_movies();
			$('#add_movie').modal('hide');
		});
	});

	// handle add actor form submission
	$('#add_actor_form').submit(function (event) {
		event.preventDefault();

		// validate form data
		if ($('#actor_movie_list').is(':empty')) {
			warn('#actor_movie_list', "You must enter at least one film")
			return;
		}

		var actor = {
			name: $('#actor_name').val(),
			age: $('#actor_age').val(),
			gender: $('#actor_gender').val(),
			agent: $('#actor_agent').val(),
			filmography: []
		}
		
		$('#actor_movie_list').find("li").each(function (index, element) {
			actor.filmography.push($(element).contents()[0].data);
		});
		
		$.post('/actors', actor, function (response) {
			load_actors();
			$('#add_actor').modal('hide');
		});
	});

	// handle add director form submission
	$('#add_director_form').submit(function (event) {
		event.preventDefault();
		
		// validate form data
		if ($('#director_movie_list').is(':empty')) {
			warn('#director_movie_list', "You must enter at least one film")
			return;
		}
		
		var director = {
			name: $('#director_name').val(),
			age: $('#director_age').val(),
			gender: $('#director_gender').val(),
			directed: []
		}
		
		$('#director_movie_list').find("li").each(function (index, element) {
			director.directed.push($(element).contents()[0].data);
		});
		
		$.post('/directors', director, function (response) {
			load_directors();
			$('#add_director').modal('hide');
		});
	});

	// handle movie object editing
	$(document).on('click', '.edit-movie', function (event) {
		// reset actor and director lists
		$('#edit_movie_form').find('li').remove();

		var id = $(this).data('id');
		$.get('/movies/' + id, function (movie) {
			$('#edit_movie_title').html(movie.title);
			$('#edit_rating_range').val(movie.rating);
			$('#edit_rating_display').html(movie.rating);
			$('#edit_movie_description').val(movie.description);
			$('#edit_movie_release_year').val(movie.release_year);
			movie.actors.forEach(function (value, index) { 
				$('#edit_actor_list').append($('<li>', { text: value }).append(
					$('<button>', { html: '&times;' }).addClass('btn-delete-list-item btn btn-xs btn-danger')
				));
			});
			movie.directors.forEach(function (value, index) {
				$('#edit_director_list').append($('<li>', { text: value }).append(
					$('<button>', { html: '&times;' }).addClass('btn-delete-list-item btn btn-xs btn-danger')
				));
			});
			$('#edit_movie').modal('show');
		});
	});

	// handle edit movie form submit
	$('#edit_movie_form').submit(function (event) {
		event.preventDefault();
		
		// validate form data
		if ($('#edit_actor_list').is(':empty')) {
			warn('#edit_actor_list', "You must enter at least one actor")
			return;
		}
		if ($('#edit_director_list').is(':empty')) {
			warn('#director_list', "You must enter at least one director")
			return;
		}
		
		var movie = {
			title: $('#edit_movie_title').html(),
			rating: $('#edit_rating_range').val(),
			description: $('#edit_movie_description').val(),
			release_year: $('#edit_movie_release_year').val(),
			actors: [],
			directors: []
		}
		$('#edit_actor_list').find("li").each(function (index, element) {
			movie.actors.push($(element).contents()[0].data);
			
		});
		$('#edit_director_list').find("li").each(function (index, element) {
			movie.directors.push($(element).contents()[0].data);
		});
		$.ajax({
			type: 'PUT',
			url: '/movies/' + normalize_id(movie.title),
			data: movie,
			success: function (response) {
				load_movies();
				$('#edit_movie').modal('hide');
			}
		});
	});

	// handle actor object editing
	$(document).on('click', '.edit-actor', function (event) {
		// reset film list
		$('#edit_actor_form').find('li').remove();
		
		var id = $(this).data('id');
		$.get('/actors/' + id, function (actor) {
			$('#edit_actor_name').html(actor.name);
			$('#edit_actor_age').val(actor.age);
			$('#edit_actor_agent').val(actor.agent);
			actor.filmography.forEach(function (value, index) {
				$('#edit_actor_movie_list').append($('<li>', { text: value }).append(
					$('<button>', { html: '&times;' }).addClass('btn-delete-list-item btn btn-xs btn-danger')
				));
			});
			$('#edit_actor').modal('show');
		});
	});

	// handle edit actor form submit
	$('#edit_actor_form').submit(function (event) {
		event.preventDefault();
		
		// validate form data
		if ($('#edit_actor_movie_list').is(':empty')) {
			warn('#edit_actor_movie_list', "You must enter at least one film")
			return;
		}
		
		var actor = {
			name: $('#edit_actor_name').html(),
			age: $('#edit_actor_age').val(),
			agent: $('#edit_actor_agent').val(),
			filmography: []
		}
		
		$('#edit_actor_movie_list').find("li").each(function (index, element) {
			actor.filmography.push($(element).contents()[0].data);
		});
		
		$.ajax({
			type: 'PUT',
			url: '/actors/' + normalize_id(actor.name),
			data: actor,
			success: function (response) {
				load_actors();
				$('#edit_actor').modal('hide');
			}
		});
	});

	// handle director object editing
	$(document).on('click', '.edit-director', function (event) {
		// reset film list
		$('#edit_director_form').find('li').remove();
		
		var id = $(this).data('id');
		$.get('/directors/' + id, function (director) {
			$('#edit_director_name').html(director.name);
			$('#edit_director_age').val(director.age);
			director.directed.forEach(function (value, index) {
				$('#edit_director_movie_list').append($('<li>', { text: value }).append(
					$('<button>', { html: '&times;' }).addClass('btn-delete-list-item btn btn-xs btn-danger')
				));
			});
			$('#edit_director').modal('show');
		});
	});

	// handle edit director form submit
	$('#edit_director_form').submit(function (event) {
		event.preventDefault();
		
		// validate form data
		if ($('#edit_director_movie_list').is(':empty')) {
			warn('#edit_director_movie_list', "You must enter at least one film")
			return;
		}
		
		var director = {
			name: $('#edit_director_name').html(),
			age: $('#edit_director_age').val(),
			directed: []
		}
		
		$('#edit_director_movie_list').find("li").each(function (index, element) {
			director.directed.push($(element).contents()[0].data);
		});
		
		$.ajax({
			type: 'PUT',
			url: '/directors/' + normalize_id(director.name),
			data: director,
			success: function (response) {
				load_directors();
				$('#edit_director').modal('hide');
			}
		});
	});

	// intercept anchor urls to toggle the relevant item
	$(window).on('hashchange', function () {
		if ($(window.location.hash)) {
			var collapse_hash = window.location.hash + "-collapse";
			$(collapse_hash).parents('.panel-group').find('.collapse').collapse('hide');	
			$(collapse_hash).collapse('show');
		}
	});

	// handle search box behavior
	$('#search_form').submit(function (event) { event.preventDefault(); })

	$('#search').on('input', function () {
		$('#search_results').empty();
		if ($('#search').val().trim() !== "") {
			searchFor($('#search').val(), function (result) {
				if (result.length > 0) {
					result.forEach(function (value) {
						var name;
						if (value.title) name = value.title;
						else if (value.name) name = value.name;
						$('#search_results').append(
							$('<a>', { href: '#' + value.id }).addClass('list-group-item').append(
								$('<h4>', { text: name }).addClass('list-group-item-header'),
								$('<p>', { html: '<strong>' + value.type + '</strong>'}).addClass('list-group-item-text')
							)
						)
					});
				} else {
					$('#search_results').append(
						$('<p>', { text: 'No search results found.' })
					);
				}
				$('#search_results').show();
			});
		}
	});

	$('#search').blur(function (event) {
		$('#search').val("");
		if (event.relatedTarget && event.relatedTarget.href)
			document.location.href = event.relatedTarget.href;
		$('#search_results').hide();
	});

});

// function to search the database
function searchFor(input, callback) {
	input = normalize_id(input); // normalize the input
	var inputRegEx = new RegExp('^' + input + '.*');
	var result = [];
	$.get('/movies', function (movies) {
		movies.forEach(function (movie) {
			if (inputRegEx.test(movie.id)) {
				movie.type = 'Movie';
				result.push(movie);
			}
		});
		$.get('/actors', function (actors) {
			actors.forEach(function (actor) {
				if (inputRegEx.test(actor.id)) {
					actor.type = 'Actor';
					result.push(actor);
				}
			});
			$.get('/directors', function (directors) {
				directors.forEach(function (director) {
					if (inputRegEx.test(director.id)) {
						director.type = 'Director';
						result.push(director);
					}
				});
				callback(result);
			});
		});
	});
};

// function that generates a warning message
function warn(parent_id, message) {
	var parent = $(parent_id);
	var warning =
		$('<div>').addClass('alert alert-danger').append(
			$('<span>').addClass('glyphicon glyphicon-exclamation-sign')
		).append(" " + message);
	parent.append(warning);
}

// function to load the movie list
function load_movies() {
	$('#movies').empty();
	$.get('/movies', function (response) {
		response.forEach(function (movie) {
			var actor_list = $('<ul>').addClass('list-unstyled list-group-item-text');
			var director_list = $('<ul>').addClass('list-unstyled list-group-item-text');
			$('#movies').append(
				$('<div>').addClass('panel panel-default').append(
					$('<div>').addClass('panel-heading').append(
						$('<h3>').addClass('panel-title').append(
							$('<a>', {
								id: movie.id, href: '#' + movie.id + '-collapse', text: movie.title + " (" + movie.release_year + ")",
								'data-toggle': 'collapse'	, 'data-parent': '#movies'
							})
						).append(
							$('<a>', { href: '#', 'data-type': 'movies', 'data-id': movie.id }).addClass('delete-item pull-right btn btn-xs').append($('<span>').addClass('glyphicon glyphicon-remove-sign')),
							$('<a>', { href: '#', 'data-id': movie.id }).addClass('edit-movie pull-right btn btn-xs').append($('<span>').addClass('glyphicon glyphicon-edit'))
						)
					).add(
						$('<div>', { id: movie.id + '-collapse' }).addClass('panel-collapse collapse').html(						
							$('<ul>').addClass('list-group').append(
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Description" }).addClass('list-group-item-heading'),
									$('<p>', {text: movie.description}).addClass('list-group-item-text')
								),
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Rating" }).addClass('list-group-item-heading'),
									$('<p>', { text: movie.rating }).addClass('list-group-item-text')
								),
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Lead Actors" }).addClass('list-group-item-heading')
								).append($(actor_list)),
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Directors" }).addClass('list-group-item-heading')
								).append($(director_list))
							)
						)
					)
				)
			);
			movie.actors.forEach(function (actor_name) {
				$(actor_list).append(
					$('<li>')
					.html($('<a>', {href: "#" + normalize_id(actor_name), text: actor_name}))
				);
			});
			movie.directors.forEach(function (director_name) {
				$(director_list).append(
					$('<li>')
					.html($('<a>', { href: "#" + normalize_id(director_name), text: director_name }))
				);
			});
		});
	});
}

// function to load the actor list
function load_actors() {
	$('#actors').empty();
	$.get('/actors', function (response) {
		response.forEach(function (actor) {
			var film_list = $('<ul>').addClass('list-unstyled list-group-item-text');
			$('#actors').append(
				$('<div>').addClass('panel panel-default').append(
					$('<div>').addClass('panel-heading').append(
						$('<h3>').addClass('panel-title').append(
							$('<a>', {
								id: actor.id, href: '#' + actor.id + '-collapse', text: actor.name,
								'data-toggle': 'collapse', 'data-parent': '#actors'
							}).append('<span>')
						).append(
							$('<a>', { href: '#', 'data-type': 'actors', 'data-id': actor.id }).addClass('delete-item pull-right btn btn-xs').append($('<span>').addClass('glyphicon glyphicon-remove-sign')),
							$('<a>', {href: '#', 'data-type': 'actors', 'data-id': actor.id }).addClass('edit-actor pull-right btn btn-xs').append($('<span>').addClass('glyphicon glyphicon-edit'))
						)
					).add(
						$('<div>', { id: actor.id + '-collapse' }).addClass('panel-collapse collapse').html(
							$('<ul>').addClass('list-group').append(
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Age" }).addClass('list-group-item-heading'),
									$('<p>', {text: actor.age}).addClass('list-group-item-text')
								),
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Agent" }).addClass('list-group-item-heading'),
									$('<p>', {text: actor.agent}).addClass('list-group-item-text')
								),
								$('<li>').addClass('list-group-item').append(
									$('<h4>', {text: "Filmography"}).addClass('list-group-item-heading')
								).append($(film_list))
							)
						)
					)
				)
			);
			actor.filmography.forEach(function (film_name) {
				$(film_list).append(
					$('<li>')
					.html($('<a>', { href: "#" + normalize_id(film_name), text: film_name }))
				);
			});
		});
	});
}

// function to load the director list
function load_directors() {
	$('#directors').empty();
	$.get('/directors', function (response) {
		response.forEach(function (director) {
			var film_list = $('<ul>').addClass('list-unstyled list-group-item-text');
			$('#directors').append(
				$('<div>').addClass('panel panel-default').append(
					$('<div>').addClass('panel-heading').append(
						$('<h3>').addClass('panel-title').append(
							$('<a>', {
								id: director.id, href: '#' + director.id + '-collapse', text: director.name,
								'data-toggle': 'collapse', 'data-parent': '#directors'
							})
						).append(
							$('<a>', { href: '#', 'data-type': 'directors', 'data-id': director.id }).addClass('delete-item pull-right btn btn-xs').append($('<span>').addClass('glyphicon glyphicon-remove-sign')),
							$('<a>', { href: '#', 'data-type': 'directors', 'data-id': director.id }).addClass('edit-director pull-right btn btn-xs').append($('<span>').addClass('glyphicon glyphicon-edit'))
						)
					).add(
						$('<div>', { id: director.id + '-collapse' }).addClass('panel-collapse collapse').html(
							$('<ul>').addClass('list-group').append(
								$('<li>').addClass('list-group-item').append(
									$('<h4>', { text: "Age" }).addClass('list-group-item-heading'),
									$('<p>', {text: director.age}).addClass('list-group-item-text')
								),
								$('<li>').addClass('list-group-item').append(
									$('<h4>', {text: "Movies Directed"}).addClass('list-group-item-heading')
								).append($(film_list))
							)
						)
					)
				)
			);
			director.directed.forEach(function (film_name) {
				$(film_list).append(
					$('<li>')
					.html($('<a>', { href: "#" + normalize_id(film_name), text: film_name }))
				);
			});
		});
	});
}

// helper function to generate an id from a name
function normalize_id(name) {
	return name.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
}