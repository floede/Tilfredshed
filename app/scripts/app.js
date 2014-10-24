//(function(document) {
//  'use strict';

//  document.addEventListener('polymer-ready', function() {
    // Perform some behaviour
//    console.log('Polymer is ready to rock!');
//  });

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
//})(wrap(document));

var now = moment(); 	

var tilfredshedRef = new Firebase("https://tilfredshed.firebaseio.com/");
var tilfredshedPosRef = new Firebase("https://tilfredshed.firebaseio.com/positives/");
var tilfredshedNegRef = new Firebase("https://tilfredshed.firebaseio.com/negatives/");
var tilfredshedNeutRef = new Firebase("https://tilfredshed.firebaseio.com/neutrals/");  	

function init() {

	var posTemp = document.querySelector('#pos-template');
	var neutTemp = document.querySelector('#neut-template');
	var negTemp = document.querySelector('#neg-template');

	tilfredshedRef.on('value', function(snapshot){
		reasons = snapshot.val();

		var tilfredshedsPosList = [];
		sortVotes(tilfredshedsPosList, reasons.positives);	
		posTemp.positives = tilfredshedsPosList;

		var tilfredshedsNeutList = [];
		sortVotes(tilfredshedsNeutList, reasons.neutrals);
		neutTemp.neutrals = tilfredshedsNeutList;

		var tilfredshedsNegList = [];
		sortVotes(tilfredshedsNegList, reasons.negatives);
		negTemp.negatives = tilfredshedsNegList;
	});
};

function sortVotes(listArr, dbObject){
	for(var key in dbObject){
	    if(dbObject.hasOwnProperty(key)){
	    	dbObject[key].weight = getWeight(dbObject[key].votes);
	    	dbObject[key].id = key;
	        listArr.push(dbObject[key]);
	    }
	}
	SortByWeight(listArr);
	return listArr;
};

function getWeight(votes){
	count = 0;
	$.each(votes, function ( index, value) {
		if(votes[index]) {
			var then = moment(votes[index].date, "YYYYMMDD");
			var diff = 10 - now.diff(then, 'days');
			if (diff > 0) {
				count = count + diff;
			}
		}	
	});
	weight = ((count >= 100 ? 1.0 : count/100));
	return weight;
};

function SortByWeight(arr){
	arr.sort(function(a, b){
		return b.weight-a.weight;
	})	
}

$(document).ready(function() {
	init();
});