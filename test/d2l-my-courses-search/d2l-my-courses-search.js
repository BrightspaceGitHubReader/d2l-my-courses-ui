describe('d2l-my-courses-search', function() {
	let widget;

	beforeEach(function(done) {
		widget = fixture('d2l-my-courses-search-fixture');
		requestAnimationFrame(() => {
			done();
		});
	});

	describe('Event', function() {
		it('should fire an event when a search is done', function(done) {
			widget.addEventListener('d2l-my-courses-search-change', (e) => {
				expect(e.detail.value).to.equal('test');
				done();
			});

			widget._getSearchInput().value = 'test';
			widget._getSearchInput().search();
		});
	});

	describe('Clear', function() {
		it('should fire an event and clear the search input', function(done) {
			widget.addEventListener('d2l-my-courses-search-change', (e) => {
				expect(e.detail.value).to.equal('');
				done();
			});

			widget._getSearchInput().value = 'test';
			widget.clear();
		});
	});
});
