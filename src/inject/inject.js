var rulesObj = {
		":5601" : [
			["body > div.content > div > div > dashboard-grid > ul > li:nth-child(10) > dashboard-panel", "rgb(87, 193, 123)", "rgb(191, 175, 64)"],
			["body > div.content > div > div > dashboard-grid > ul > li:nth-child(7) > dashboard-panel", "rgb(87, 193, 123)", "rgb(191, 175, 64)"]
		],
		"7383" : [
			[".nav.nav-tabs","rgb(66, 139, 202)","red"]
		]
	};

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
	var ruleUris = Object.keys(rulesObj);
	for (i = 0; i < ruleUris.length; i++) {
		var match = window.location.href.match(RegExp(ruleUris[i]));
		if (match && match.length > 0) {
			break;
		}
	}
	if (i === ruleUris.length) 
		return;
	var rules = rulesObj[ruleUris[i]];
    for (i = 0; i < rules.length; i++) {
		replaceColorInSelector(rules[i][0], rules[i][1], rules[i][2]);
	}
}

$(document).ready(init);

function init() {
	replaceColorsInDom();
	$("body").append('<div id="recolorIt"></div>');
	$("#recolorIt").append('<div class="recolorit-modal recolorit-container"></div>');
	$(".recolorit-modal").append(getInputRowHtml(undefined, true));
	$("#recolorIt .recolorit-modal").easyModal();
	$("#recolorIt .recolorit-modal").trigger('openModal');
	getConfigFromLocalStorage();
}

function getInputRowHtml(values , isTop) {
	if (!values || $.isEmptyObject(values)) {
		values = {regex:"", csspath:"", from:"", to:""}
	}
	var html = '<div class="row insert-rule">\
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
										</div>' + ((isTop) ? '<div class="two columns"><button class="button-primary save-new-rule">Save</button></div>' : '<div class="one column"><button class="button-primary update-rule">Update</button></div><div class="one column"><button class="button-primary delete-rule">DELETE</button></div>') + 
						  '</div>'
	return html;
}

function getConfigFromLocalStorage() {
	rulesObj = JSON.parse(localStorage.getItem("rulesObj"));
}
