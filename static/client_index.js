function loadInTopics() {
	
//AJAX to get topics
	$.ajax(
		'http://community.dur.ac.uk/ryan.collins/faq2016/FAQAPI/topics/topics.php',
		{
		type: "get",
		contentType: "application/json",
		success: function(resp,status) {
			var data = resp.topics;	
			for(var i = 0; i < data.length; i++) {
				$('#topic-select').append($('<option>', {value : data[i]})
								  .text(data[i]));
			}
		}
	});
}

function getTweetDetails() {
    var data = {
        "topic": document.getElementById("topic-select").selectedIndex + 1,
        "text": $('#search-txt').val()
    };
    $.get('http://127.0.0.1/',data,function(resp,status) {
        var positiveTweets = resp.tweets.positive;
        positiveTweets.forEach(function(current,index,arr) {
            // render each of the positive tweets
            var container = 
        });
    });
}



function renderFAQs() {
	//get topic id
	//get optional search terms
	var topicID = document.getElementById("topic-select").selectedIndex + 1;
	var topicStr = $('#search-txt').val();
	var dataToSend = {};
	console.log(topicID);
	console.log(topicStr);

	if(topicID === 0) {
		return false;
	}
	
	dataToSend['topic'] = topicID;

	if(topicStr.length > 0) {
		dataToSend['q'] = topicStr;
	}

	$('#faq-list-display').html('');
	$.ajax(
		'http://community.dur.ac.uk/ryan.collins/faq2016/FAQAPI/topics/faqs.php',
		{
		type: "get",
		dataType: "json",
		contentType: "application/json",
		data: dataToSend,
		success: function(resp, status) {
			var faqDetails = resp;
			console.log(faqDetails);
			for(var j = 0; j < faqDetails['faqs'].length; j++) {
				//now we shall create our nice HTML
				var container = $('<a></a>',{class: "list-group-item"});
				var headingE = ($('<h4></h4>',{class:"list-group-item-heading"}).text(faqDetails.faqs[j].question));
				var paragraphE = ($('<p></p>',{class:"list-group-item-text"}).text(faqDetails.faqs[j].answer));
				container.append(headingE);
				container.append(paragraphE);
				$('#faq-list-display').append(container);
				console.log(container);
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
			alert(thrownError);

			}
	});
	//AJAX to get the data for the required FAQs


	//render FAQs in the list
}


//event handlers
// load in the topics from AJAX request
$(document).ready(function() {
	loadInTopics();
	renderFAQs();
});

// update the questions on topic change (or some selection)
$('#topic-select').change(function() {
	renderFAQs();
});