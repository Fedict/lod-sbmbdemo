function Fetcher() {
	this.parser = new NtParser();
}

Fetcher.prototype.getParser = function() {
	return this.parser;
}

/**
 * Get N-Triples from another website using a HTTP get in the background.
 *
 * @param {string} url
 */
Fetcher.prototype.getTriples = function(url) {
	var req = new Request(url, {
		method: 'GET',
		redirect: 'follow',
		mode: 'cors',
		headers: new Headers({ 'Accept': 'application/n-triples'})
	});

	// don't use => operators, not supported by IE11
	var self = this;
	return fetch(req).then(function(resp) {
				return resp.text();
				})
			.then(function(txt) {
				return self.parser.parseTriples(txt);
			});
}
