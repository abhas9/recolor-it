var rulesObj = {};

function replaceColorInSelector(selector, from, to) {
	$(selector + " *").each(function(index) {
		this.style.cssText = this.style.cssText.replace(from, to);
		if ($(this).css("color") === from) {
			$(this).css("color",to);
		}
	})
}

$(document).bind('DOMNodeInserted', replaceColorsInDom);

function replaceColorsInDom(e) {
	var i;
	if ($.isEmptyObject(rulesObj))
		return;
	var ruleUris = Object.keys(rulesObj);
	for (i = 0; i < ruleUris.length; i++) {
		var match = window.location.href.match(RegExp(ruleUris[i]));
		if (match && match.length > 0) {
			break;
		}
	}
	if (i === ruleUris.length) 
		return;

 for (var ruleid in rulesObj[ruleUris[i]]) {
		replaceColorInSelector(rulesObj[ruleUris[i]][ruleid][0], rulesObj[ruleUris[i]][ruleid][1], rulesObj[ruleUris[i]][ruleid][2]);
	}
}

$(document).ready(init);

function init() {
	replaceColorsInDom();
	$("body").append('<div id="recolorIt"></div>');
	$("#recolorIt").append('<div class="recolorit-modal recolorit-container"></div>');
	$("#recolorIt .recolorit-modal").append(getInputRowHtml(undefined, true));
	$("#recolorIt .recolorit-modal").append('<div class="saved-rules"></div>');
	$("#recolorIt .recolorit-modal").easyModal({top: 100});
	$("#recolorIt .recolorit-modal").trigger('openModal');
	$("#recolorIt").on('click' , ".delete-rule", deleteRecolorRule);
	$("#recolorIt").on('click' , ".update-rule", updateRecolorRule);

	getConfigFromLocalStorage();
}

function getInputRowHtml(values , isTop) {
	if (!values || $.isEmptyObject(values)) {
		values = {ruleid:"", regex:"", csspath:"", from:"", to:""}
	}
	var html = '<div class="row insert-rule" data-ruleid="' + values.ruleid + '" data-regex="' + values.regex + '">\
										<div class="three columns">\
											<input class="u-full-width regex" value="'+ values.regex + '" type="text" placeholder="RegExp for page in URL"/>\
										</div>\
										<div class="three columns">\
											<input class="u-full-width csspath" value="'+ values.csspath + '" type="text" placeholder="CSS Path of parent element"/>\
										</div>\
										<div class="two columns">\
											<input class="u-full-width from" value="'+ values.from + '" type="text" placeholder="Initial color in rgb"/>\
										</div>\
										<div class="two columns">\
											<input class="u-full-width to" value="'+ values.to + '" type="text" placeholder="New color in rgb"/>\
										</div>' + ((isTop) ? ('<div class="two columns"><button class="button-primary save-new-rule">Save</button></div>') : ('<div class="one column"><button class="button-primary update-rule">Update</button></div><div class="one column"><button class="button-primary delete-rule">DELETE</button></div>')) + 
						  '</div>'
	return html;
}

function updateRecolorRule(e) {
	var row = $(this).parent().parent();
	var regex = row.attr("data-regex");
	var ruleid = row.attr("data-ruleid");
	delete rulesObj[regex][ruleid];

	regex = row.find(".regex").val();
	var csspath = row.find(".csspath").val();
	var from = row.find(".from").val();
	var to = row.find(".to").val();

	rulesObj[regex][ruleid] = [csspath, from, to];
	updateLocalStorage();
}


function deleteRecolorRule(e) {
	var row = $(this).parent().parent();
	var regex = row.attr("data-regex");
	var ruleid = row.attr("data-ruleid");
	delete rulesObj[regex][ruleid];
	row.remove();
	updateLocalStorage();
}

function updateLocalStorage() {
	localStorage.setItem("rulesObj", JSON.stringify(rulesObj));
}

function getConfigFromLocalStorage() {
	var i, html;
	rulesObj = JSON.parse(localStorage.getItem("rulesObj"));
	// rulesObj = {
	// 	":5601": {
	// 		"a": ["body > div.content > div > div > dashboard-grid > ul > li:nth-child(10) > dashboard-panel", "rgb(87, 193, 123)", "rgb(191, 175, 64)"],
	// 		"b": ["body > div.content > div > div > dashboard-grid > ul > li:nth-child(7) > dashboard-panel", "rgb(87, 193, 123)", "rgb(191, 175, 64)"]
	// 	},
	// 	"7383": {
	// 		"c": [".nav.nav-tabs","rgb(66, 139, 202)","red"]
	// 	}
	// 	,
	// 	"wiki": {
	// 		"d": ["#mp-topbanner","rgb(6, 69, 173)","red"]
	// 	}	
	// };
	if (!$.isEmptyObject(rulesObj)) {
		var ruleUris = Object.keys(rulesObj);
		for (var ruleUri in rulesObj) {
			for (var ruleid in rulesObj[ruleUri]) {
				html = getInputRowHtml({ruleid: ruleid, regex: ruleUri, csspath: rulesObj[ruleUri][ruleid][0], from: rulesObj[ruleUri][ruleid][1], to: rulesObj[ruleUri][ruleid][2]}, false);
				$("#recolorIt .saved-rules").append(html);	
			}
		}
	}
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}