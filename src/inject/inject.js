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
	console.log("sssssss");
	var i;
	if ($.isEmptyObject(rulesObj))
		return;
	var matchedRuleUri = ""
	for (var ruleUri in rulesObj) {
		var match = window.location.href.match(RegExp(ruleUri));
		if (match && match.length > 0) {
			matchedRuleUri = ruleUri;
			break;
		}
	}
	if (!matchedRuleUri) 
		return;

 for (var ruleid in rulesObj[matchedRuleUri]) {
		replaceColorInSelector(rulesObj[matchedRuleUri][ruleid][0], rulesObj[matchedRuleUri][ruleid][1], rulesObj[matchedRuleUri][ruleid][2]);
	}
}

$(document).ready(init);

function init() {
	$("body").append('<div id="recolorIt"></div>');
	$("#recolorIt").append('<div class="recolorit-modal recolorit-container"></div>');
	$("#recolorIt .recolorit-modal").append(getInputRowHtml(undefined, true));
	$("#recolorIt .recolorit-modal").append('<div class="saved-rules"></div>');
	$("#recolorIt .recolorit-modal").easyModal({top: 100, onClose: replaceColorsInDom}); //TO-DO: Fix onclose to reflect change
	$("#recolorIt").on('click' , ".delete-rule", deleteRecolorRule);
	$("#recolorIt").on('click' , ".update-rule", updateRecolorRule);
	$("#recolorIt .save-new-rule").click(saveNewRule);
	getConfigFromLocalStorage();
	replaceColorsInDom();
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

function saveNewRule(obj) {
	var row = $(this).parent().parent();
	var regex = row.find(".regex").val();
	var csspath = row.find(".csspath").val();
	var from = row.find(".from").val();
	var to = row.find(".to").val();
	var ruleid = guid();
	if (regex && ruleid && csspath && from && to) {
		if (!rulesObj.hasOwnProperty(regex)) rulesObj[regex] = {};
		if (!rulesObj[regex].hasOwnProperty(ruleid)) rulesObj[ruleid] = {};
		rulesObj[regex][ruleid] = [csspath, from, to];
		var html = getInputRowHtml({ruleid: ruleid, regex: regex, csspath: csspath, from: from, to: to}, false);
		$("#recolorIt .saved-rules").prepend(html);	
		updateLocalStorage();
		row.find(".from,.to,.csspath,.regex").val("");
	}
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

	if (!rulesObj.hasOwnProperty(regex)) rulesObj[regex] = {};
	if (!rulesObj[regex].hasOwnProperty(ruleid)) rulesObj[ruleid] = {};

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

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  if( request.message === "recolorIt" ) {
	   if ($("#recolorIt .recolorit-modal:visible").length === 0) {
	   	$("#recolorIt .recolorit-modal").trigger('openModal');
	   } else {
	   	$("#recolorIt .recolorit-modal").trigger('closeModal');
	   }
	  }
	}
);