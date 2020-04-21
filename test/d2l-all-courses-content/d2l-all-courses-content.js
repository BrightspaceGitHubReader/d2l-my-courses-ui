describe('d2l-all-courses-content', function() {
	let widget;

	beforeEach(function(done) {
		widget = fixture('d2l-all-courses-content-fixture');

		setTimeout(function() {
			done();
		});
	});

	describe('Card Grid', function() {

		it('should set --course-image-card-height as part of initial setup', () => {
			const height = getComputedStyle(widget).getPropertyValue('--course-image-card-height');

			expect(height).not.to.be.null;
			expect(height).not.to.be.undefined;
			expect(height.trim()).not.to.equal('0');
			expect(height.trim()).not.to.equal('0px');
		});
	});
});
