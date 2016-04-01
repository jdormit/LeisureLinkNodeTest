$(document).ready(function () { 
	
	load_movies();
	load_actors();
	load_directors();

});

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