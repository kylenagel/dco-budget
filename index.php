<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">

	<title>Dayton.com Budget</title>

	<link rel="icon" type="image/png" href="http://media.cmgdigital.com/shared/img/photos/2014/12/11/4c/1b/dayton.com_favicon_200.png" />
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css" />
	<link href='http://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/budget.css">
	
	<script src="http://kylernagel.com/common/js/jquery/jquery-1.11.2.min.js"></script>
	<script src="http://kylernagel.com/common/js/handlebars/handlebars-v3.0.0.js"></script>
	<script src="http://kylernagel.com/common/js/momentjs/moment.js"></script>
	<script src="http://kylernagel.com/common/plugins/taffydb/taffy-min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
	<script src="js/budget.js"></script>

</head>

<body>

	<div id="container">

		<div id="banner">
			<img src="http://media.cmgdigital.com/shared/img/photos/2015/02/17/d4/d4/daytondotcomlogo632.png" alt="Dayton.com budget" title="Dayton.com budget">
		</div>
			
		<div id="search_menus">
			<div id="string_search_menu" class="search_menu">
				<h4>Search by person or category</h4>
				<div id="string_search_menu_dropdowns"></div>
				<input type="button" value="Find it!" onclick="buildStringSearchResult(document.getElementById('string_search_menu_dropdowns').getElementsByTagName('select')[0].value, document.getElementById('string_search_menu_dropdowns').getElementsByTagName('select')[1].value)">
			</div>
			<div id="date_search_menu" class="search_menu">
				<h4>Search by date range</h4>
				<div id="date_search_checkboxes">
					<input type="checkbox" id="date_search_due" name="date_search_due" onchange="toggleCheckboxes(this)">
					<label for="date_search_due">Due</label>
					<input type="checkbox" id="date_search_publish" name="date_search_publish" onchange="toggleCheckboxes(this)" checked="checked">
					<label for="date_search_due">Publish</label>
				</div>
				<div class="search_input_container"><input type="text" id="startdate" name="startdate" class="datepicker" placeholder="Start date"></div>
				<div class="search_input_container"><input type="text" id="enddate" name="enddate" class="datepicker" placeholder="End date"></div>
				<input type="button" value="Find it!" onclick="buildDateSearchResult($('#startdate').val(), $('#enddate').val(), $('#date_search_checkboxes input:checked').attr('id').split('_')[2])">
			</div>
		</div>

		<div id="search_result"></div>

		<div id="dashboard"></div>

		<div id="upcoming_stories">
			<h3>
				Stories that aren't yet:
				<span onclick="showCorrectUpcomingStories(this, 'publish')">Published</span>
				<span onclick="showCorrectUpcomingStories(this, 'due')">Due</span>
			</h3>
			<div id="upcoming_stories_result"></div>
		</div>

		<div id="categories_table">
			<h3>What categories or topics should I use?</h3>
			<table>
				<thead>
					<tr>
						<th>SECTION</th>
						<th>CATEGORY</th>
						<th>TOPIC</th>
					</tr>
				</thead>
				<tbody>
					<tr class="subhead what_to_know">
						<td colspan="100">WHAT TO KNOW</td>
					</tr>
					<tr class="body section_name what_to_know">
						<td>What to Know</td>
						<td>News/Local</td>
						<td></td>
					</tr>
					<tr class="body what_to_know">
						<td>Daytonomics</td>
						<td>Business/Economy</td>
						<td></td>
					</tr>
					<tr class="body what_to_know">
						<td>Where to Work</td>
						<td>Business/Employment</td>
						<td></td>
					</tr>
					<tr class="subhead what_to_do">
						<td colspan="100">WHAT TO DO</td>
					</tr>
					<tr class="body section_name what_to_do">
						<td>What to Do</td>
						<td>Places</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Events</td>
						<td>Events</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Bars & Clubs</td>
						<td>Places/Bar-Nightclub</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Restaurants</td>
						<td>Places/Restaurant</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Theatre & Arts</td>
						<td>Places/Theater</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Music</td>
						<td>Events/Concerts</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Parks & Rec</td>
						<td>Places/Park</td>
						<td></td>
					</tr>
					<tr class="body what_to_do">
						<td>Free & Cheap</td>
						<td>Events/Neighborhood-Community</td>
						<td></td>
					</tr>
					<tr class="subhead what_to_love">
						<td colspan="100">WHAT TO LOVE</td>
					</tr>
					<tr class="body section_name what_to_love">
						<td>What to Love</td>
						<td>Lifestyles</td>
						<td></td>
					</tr>
					<tr class="body what_to_love">
						<td>Daytonian of the Week</td>
						<td>Entertainment/Personalities</td>
						<td></td>
					</tr>
					<tr class="body what_to_love">
						<td>History</td>
						<td>News/Special Reports</td>
						<td></td>
					</tr>
					<tr class="body what_to_love">
						<td>Volunteer</td>
						<td>Events/Fundraiders/Volunteer</td>
						<td></td>
					</tr>
					<tr class="body what_to_love">
						<td>Be Green</td>
						<td>Lifestyles/Environment</td>
						<td></td>
					</tr>
					<tr class="body what_to_love">
						<td>Walk of Fame</td>
						<td>News/Special Reports</td>
						<td>walkoffame</td>
					</tr>
					<tr class="body what_to_love">
						<td>Dayton Bucket List</td>
						<td>Entertainment/Attractions</td>
						<td>bucketlist</td>
					</tr>
					<tr class="body what_to_love">
						<td>Where to Live</td>
						<td>Lifestyles/Home</td>
						<td>wheretolive</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>

</body>

<!-- DROPDOWN TEMPLATE -->
<script id="dropdown_template" type="text/x-handlebars-template">
	<div class="search_input_container">
		<select>
			<option value="">-- {{name}} --</option>
			{{#values}}
			<option value="{{this}}">{{this}}</option>
			{{/values}}
		</select>
	</div>
</script>

<!-- DASHBOARD BLOCK TEMPLATE -->
<script id="dashboard_template" type="text/x-handlebars-template">
	<div class="dashboard_block">
		<h2>{{title}}</h2>
		<table>
			{{#stories}}
			<tr>
				{{#if medleyurl}}
					<td class="title_cell"><a href="{{medleyurl}}" target="_blank">{{story}}</a></td>
				{{else}}
					<td class="title_cell">{{story}}</td>
				{{/if}}
				<td class="assigned_cell">{{assignedto}}</td>
			</tr>
			{{else}}
			<tr>
				<td colspan="100">No results to display</td>
			</tr>
			{{/stories}}
		</table>
	</div>
</script>

<!-- SEARCH RESULT TEMPLATE -->
<script id="search_result_template" type="text/x-handlebars-template">
	<div class="search_result_block">
		{{#if label}}
		<h3>{{label}}</h3>
		{{/if}}
		{{#if stories}}
		<table>
			<thead>
				<th>Story</th>
				<th>Category</th>
				<th>Assigned To</th>
				<th>Due</th>
				<th>Publish</th>
			</thead>
			<tbody>
				{{#stories}}
				<tr>
					{{#if medleyurl}}
						<td><a href="{{medleyurl}}" target="_blank">{{story}}</a></td>
					{{else}}
						<td>{{story}}</td>
					{{/if}}
					<td class="align_center">{{category}}</td>
					<td class="align_center">{{assignedto}}</td>
					<td class="align_center">{{due}}</td>
					<td class="align_center">{{publish}}</td>
				</tr>
				{{/stories}}
			</tbody>
		</table>
		{{else}}
		<p>No results to display</p>
		{{/if}}
	</div>
</script>

<script id="upcoming_stories_template" type="text/x-handlebars-template">
{{#if stories}}
<table>
	<thead>
		<tr>
			<th>Story</th>
			<th>Assigned To</th>
			<th>Due</th>
			<th>Publish</th>
			<th>Turned in</th>
			<th>Edited</th>
		</tr>
	</thead>
	<tbody>
		{{#stories}}
		<tr>
			{{#if medleyurl}}
				<td><a href="{{medleyurl}}" target="_blank">{{story}}</a></td>
			{{else}}
				<td>{{story}}</td>
			{{/if}}
			<td class="align_center">{{assignedto}}</td>
			<td class="align_center">{{due}}</td>
			<td class="align_center">{{publish}}</td>
			<td class="align_center">{{turnedin}}</td>
			<td class="align_center">{{edited}}</td>
		</tr>
		{{/stories}}
	</tbody>
</table>
{{else}}
<p>No results to display</p>
{{/if}}
</script>

</html>