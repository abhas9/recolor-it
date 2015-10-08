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
	$("body").append('<div id="yoooooo"></div>');
}


