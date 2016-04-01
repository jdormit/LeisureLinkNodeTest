$(document).ready(function () {
	
	// activate bootstrap objects
	$('.modal').modal({ show: false });

	load_movies();
	load_actors();
	load_directors();
	
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
});

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
								href: '#' + movie.id + "-collapse", text: movie.title + " (" + movie.release_year + ")",
								'data-toggle': 'collapse', 'data-parent': '#movies'
							})
						)
					).add(
						$('<div>', { id: movie.id + "-collapse" }).addClass('panel-collapse collapse').html(						
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
					.html($('<a>', {href: "/actors/" + normalize_id(actor_name), text: actor_name}))
				);
			});
			movie.directors.forEach(function (director_name) {
				$(director_list).append(
					$('<li>')
					.html($('<a>', { href: "/directors/" + normalize_id(director_name), text: director_name }))
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
								href: '#' + actor.id + "-collapse", text: actor.name,
								'data-toggle': 'collapse', 'data-parent': '#actors'
							})
						)
					).add(
						$('<div>', { id: actor.id + "-collapse" }).addClass('panel-collapse collapse').html(
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
					.html($('<a>', { href: "/movies/" + normalize_id(film_name), text: film_name }))
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
								href: '#' + director.id + "-collapse", text: director.name,
								'data-toggle': 'collapse', 'data-parent': '#directors'
							})
						)
					).add(
						$('<div>', { id: director.id + "-collapse" }).addClass('panel-collapse collapse').html(
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
					.html($('<a>', { href: "/movies/" + normalize_id(film_name), text: film_name }))
				);
			});
		});
	});
}

// helper function to generate an id from a name
function normalize_id(name) {
	return name.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
}