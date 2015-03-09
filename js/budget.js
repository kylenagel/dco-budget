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
	data.values = gsdata().order(field).distinct(field);
	$("#string_search_menu_dropdowns").append(template(data));
}

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
		query.assignedto = assignedto
	}
	if (category) {
		query.category = category
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
	data.stories = gsdata(query).order("publish").get();
	// OUTPUT THE TEMPLATE WITH THE DATA
	$("#search_result").append(template(data));
}

// FUNCTION TO BUILD DATE SEARCH RESULT
function buildDateSearchResult(startdate, enddate) {
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
		buildDateSearchResultBlock(dates[i]);
	}
	// FUNCTION TO BUILD AND OUTPUT THE RESULTS FOR INDIVIDUAL DATES
	function buildDateSearchResultBlock(date) {
		// GET TEMPLATE
		var template = $("#search_result_template").html();
		template = Handlebars.compile(template);
		// BUILD DATA
		var data = {};
		data.label = moment(date).format('dddd, MMM D')
		data.stories = gsdata({publish: date}).get();
		// OUTPUT
		$("#search_result").append(template(data));
	}
}