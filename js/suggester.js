function Suggester() {
	this.base = "https://id.belgium.be/_query/eli/filter-by-docdate";
	this.pattern = /(wet|loi|decr|kb|ar|mb|am)\s*([0-3]?\d)[/-]?((0|1)?\d)[/-]?((18|19|20)\d\d)/;
	this.mapping = { "wet": "LAW", "loi": "LAW",
			"decr": "DECREE", "ord": "ORD",
			"kb": "DECISION", "ar": "DECISION",
			"mb": "DECISION", "am": "DECISION"};
}
	

/**
 * Build the URL for getting the suggestions  
 *
 * @param {Map} values
 */
Suggester.prototype.buildUrl = function(str) {
	if (str.length < 11) {
		return false;
	}
	/* most browsers don't support 'i' flag on pattern */
	var m = str.toLowerCase().match(this.pattern);
	if (!m) {
		return false;
	}

	var t = m[1];
	var doctype = this.mapping[t];
	if (!doctype) {
		return false;
	}
	var docdate = new Date(Date.UTC(m[5], m[3]-1, m[2]));
	if (docdate.getFullYear() < 1800) {
		return false;
	}
	var dstr = docdate.toISOString().substring(0,10);

	return this.base + '?date=' + dstr + '&type=' + doctype;
}

/**
 * Parse N-Triples data into map of triples
 */
Suggester.prototype.parse = function(data) {
	var title = '<http://data.europa.eu/eli/ontology#title>';

	return data.then(function(triples) {
		var map = [];
		triples.forEach(function(triple) {
			var s = triple[0];
			var p = triple[1];
			var o = triple[2];

			if (p == title) {
				map[s] = o;
			}
		});
		return map;
	});
}
