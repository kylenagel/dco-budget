// build taffydb query: http://stackoverflow.com/questions/18607451/using-a-variable-name-as-a-column-name-in-taffydb

// INIT VARIABLE TO MASTER DATA
var gsdata = '';

// ARRAY OF PARAMETERS FOR FUNCTION makeDropdown
var dropdowns = [
	{
		name: 'Staff',
		property: 'assignedto'
	},
	{
		name: 'Category',
		property: 'category'
	},
]

// ARRAY OF PARAMETERS FOR FUNCTION makeDashboardBlock
var dashboards = [
	{
		title: 'Due today',
		column: 'due',
		operator: '==',
		value: moment().format('MM/DD/YYYY')
	},
	{
		title: 'Publishing today',
		column: 'publish',
		operator: '==',
		value: moment().format('MM/DD/YYYY')
	},
	/*
	{
		title: 'Unedited',
		column: 'edited',
		operator: '==',
		value: 'N'
	},
	{
		title: 'Unassigned',
		column: 'assignedto',
		operator: '==',
		value: 'Need to assign'
	}
	*/
]

// GET DATA FROM SPREADSHEET
$.ajax({
	url: 'https://spreadsheets.google.com/feeds/list/1DC5ZkS3Dmde7a2kL77BKUtIB-3pdIN8YjFDLZpVuCww/od6/public/full?alt=json',
	dataType: 'json',
	success: function(result) {
		gsdata = TAFFY(parseGSData(result.feed.entry));
		// SET DATE MENUS AS DATEPICKERS
		$(".datepicker").datepicker();
		// BUILD DROPDOWNS
		for (var i=0; i<dropdowns.length; i++) {
			makeDropdown(dropdowns[i].name, dropdowns[i].property);
		}
		// BUILD DASHBOARD BLOCKS
		for (var i=0; i<dashboards.length; i++) {
			makeDashboardBlock(dashboards[i].title, dashboards[i].column, dashboards[i].operator, dashboards[i].value);
		}
		// SHOW UNPUBLISHED STORIES IN TABLE
		showCorrectUpcomingStories(document.getElementById("upcoming_stories").getElementsByTagName("h3")[0].getElementsByTagName("span")[0], 'publish');
	}
});

// FUNCTION TO MAKE GS OUTPUT INTO SIMPLE KEY->VALUE PAIRS
function parseGSData(d) {
	// FUNCTION TO GET KEYS AND DELETE "gsx$" FROM THEM
	function getGSKeys(d) {
		// get keys of first index
		var keys = Object.keys(d[0]);
		// init array of keys we'll keep after check for "gsx"
		var keep_keys = []
		// loop and keep keys that start with "gsx"
		for (var i=0; i<keys.length; i++) {
			if (keys[i].search("gsx") != -1) {
				keep_keys.push(keys[i].replace("gsx$", ""));
			}
		}
		return keep_keys;
	}
	// FUNCTION TO MAKE NEW ARRAY OF SIMPLE KEY->VALUE PAIRS
	function buildNewGSArray(d) {
		var keys = getGSKeys(d);
		var data = []
		for (var i=0; i<d.length; i++) {
			data.push({});
			for (var k=0; k<keys.length; k++) {
				data[data.length-1][keys[k]] = d[i]["gsx$"+keys[k]]["$t"];
			}
		}
		return data;
	}
	// GET CLEAN DATA
	var data = buildNewGSArray(d);
	// RETURN CLEAN DATA
	return data;
}

// FUNCTION TO PULL DROPDOWN TEMPLATE
// & MAKE DATA & SEND DATA
function makeDropdown(category, field) {
	var template = $("#dropdown_template").html();
	template = Handlebars.compile(template);
	var data = {};
	data.name = category;
	data.values = gsdata().order(field).distinct_multiple_values(field);
	$("#string_search_menu_dropdowns").append(template(data));
}

// TAFFY EXTENSION FOR GETTING DISTINCT VALUES WHEN
// COLUMNS HAVE MULTIPLE VALUES
TAFFY.extend("distinct_multiple_values", function(c) {
	// This runs the query or returns the results if it has already run
	this.context({
           results: this.getDBI().query(this.context())
    });
	var distinct_values = []
	TAFFY.each(this.context().results, function(r) {
		if (r[c].indexOf(",") != -1) {
			var column_values = r[c].split(", ");
			for (var i=0; i<column_values.length; i++) {
				if (distinct_values.indexOf(column_values[i]) == -1) {
					distinct_values.push(column_values[i]);
				}
			}
		}
		else {
			if (distinct_values.indexOf(r[c]) == -1) {
				distinct_values.push(r[c]);
			}
		}
	});
	distinct_values.sort();
	return distinct_values;
});

// TAFFY EXTENTION FOR QUERYING STORIES
// NOT YET PUBLISHED OR NOT YET DUE
TAFFY.extend('upcoming', function(c) {
	var today = moment().format('MM/DD/YYYY');
	// This runs the query or returns the results if it has already run
	this.context({
           results: this.getDBI().query(this.context())
    });
    var upcoming = [];
    TAFFY.each(this.context().results, function(r) {
    	if (r[c] != '' && moment(r[c]).format('MM/DD/YYYY') >= today) {
    		upcoming.push(r);
    	}
    });
    return upcoming;
});

// TAFFY EXTENTION FOR QUERYING STORIES
// NOT YET PUBLISHED OR NOT YET DUE
TAFFY.extend('not_yet_due_or_published', function(c) {
	var today = moment().format('MM/DD/YYYY');
	// This runs the query or returns the results if it has already run
	this.context({
           results: this.getDBI().query(this.context())
    });
    var upcoming = [];
    TAFFY.each(this.context().results, function(r) {
    	if (r['due'] != '' && moment(r['due']).format('MM/DD/YYYY') >= today || r['publish'] != '' && moment(r['publish']).format('MM/DD/YYYY') >= today) {
    		upcoming.push(r);
    	}
    });
    return upcoming;
});


// FUNCTION TO BUILD A BLOCK OF THE DASHBOARD
function makeDashboardBlock(title, column, operator, value) {
	var query = {}
	query[column] = {}
	query[column][operator] = value;
	var template = $("#dashboard_template").html();
	template = Handlebars.compile(template);
	var data = {};
	data.title = title;
	data.stories = gsdata(query).get();
	$("#dashboard").append(template(data));
}

// FUNCTION TO BUILD STAFF AND CATEGORY SEARCH RESULT
function buildStringSearchResult(assignedto,category) {
	$("#search_result").html('');
	// BUILD QUERY
	var query = {};
	if (assignedto) {
		query.assignedto = {};
		query.assignedto["likenocase"] = assignedto
	}
	if (category) {
		query.category = {};
		query.category["likenocase"] = category
	}
	// GET TEMPLATE
	var template = $("#search_result_template").html();
	template = Handlebars.compile(template);
	// BUILD DATA
	var data = {};
	// SET THE LABEL DEPENDING ON THE PARAMETERS
	data.label = '';
	if (assignedto) {
		data.label += 'Assigned to: '+assignedto;
	}
	if (data.label && category) {
		data.label += '. Category: '+category;
	}
	if (!data.label && category) {
		data.label += 'Category: '+category;
	}
	// QUERY THE DATA
	data.stories = gsdata(query).order("due").not_yet_due_or_published();
	// OUTPUT THE TEMPLATE WITH THE DATA
	$("#search_result").append(template(data));
}

// FUNCTION TO BUILD DATE SEARCH RESULT
function buildDateSearchResult(startdate, enddate, search_property) {
	// EMPTY THE SEARCH RESULT CONTAINER
	$("#search_result").html('');
	// INIT AN ARRAY OF CHOSEN DATES
	var dates = []
	// INIT START DATE FOR LATER CHECK AGAINST THE END DATE
	var first_date = moment(startdate);
	// ADD FIRST DATE TO THE ARRAY
	dates.push(first_date.format('MM/DD/YYYY'));
	// IF THERE'S ALSO AN END DATE, BUILD AN ARRAY OF 
	// START AND END DATES AND ALL DATES IN BETWEEN
	if (enddate) {
		var number_of_days = moment(enddate).diff(first_date, 'days')+1;
		for (var i=1; i<number_of_days; i++) {
			dates.push(moment(dates[dates.length-1]).add(1, 'day').format('MM/DD/YYYY'));
		}
	}
	// LOOP THROUGH DATES AND BUILD A BLOCK FOR EACH DATE
	for (var i=0; i<dates.length; i++) {
		buildDateSearchResultBlock(dates[i], search_property);
	}
	// FUNCTION TO BUILD AND OUTPUT THE RESULTS FOR INDIVIDUAL DATES
	function buildDateSearchResultBlock(date, search_property) {
		console.log(search_property);
		// GET TEMPLATE
		var template = $("#search_result_template").html();
		template = Handlebars.compile(template);
		// SET QUERY
		var query = {}
		query[search_property] = date;
		// BUILD DATA
		var data = {};
		data.label = moment(date).format('dddd, MMM D')
		data.stories = gsdata(query).get();
		// OUTPUT
		$("#search_result").append(template(data));
	}
}

function toggleCheckboxes(el) {
	var checkboxes = document.getElementById("date_search_checkboxes").getElementsByTagName("input");
	for(var i=0; i<checkboxes.length; i++) {
		checkboxes[i].checked = false
	}
	el.checked = true;
}

function showCorrectUpcomingStories(el, type) {
	var data = {};
	data.stories = gsdata().order(type).upcoming(type);
	var template = $("#upcoming_stories_template").html();
	template = Handlebars.compile(template);
	$("#upcoming_stories_result").html(template(data));
	$("#upcoming_stories h3 span").removeClass("active");
	$(el).addClass("active")
}