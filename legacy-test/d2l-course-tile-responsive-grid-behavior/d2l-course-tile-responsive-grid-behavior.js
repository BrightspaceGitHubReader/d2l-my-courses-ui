describe('d2l-course-tile-responsive-grid-behavior', function() {
	var component;

	beforeEach(function() {
		component = fixture('default-fixture');
	});

	describe('column calculations', function() {
		it('should properly respond to a window resize event', function(done) {
			sinon
				.stub(component, 'getCourseTileItemCount')
				.returns(1);
			sinon
				.stub(component, '_getAvailableWidth')
				.returns(1024);

			window.dispatchEvent(new Event('resize'));

			// Because of the throttled event listener, need to allow some time
			setTimeout(function() {
				expect(component._numCols).to.equal(2);
				done();
			}, 100);
		});

		it('should properly respond to a "recalculate-columns" event', function() {
			sinon
				.stub(component, 'getCourseTileItemCount')
				.returns(1);
			sinon
				.stub(component, '_getAvailableWidth')
				.returns(1024);

			window.dispatchEvent(new Event('recalculate-columns'));

			expect(component._numCols).to.equal(2);
		});

		it('should have the correct number of columns based on the number of course tiles', function() {
			[{
				width: 767,
				itemCount: 0,
				expectedColumns: 1
			}, {
				width: 767,
				itemCount: 3,
				expectedColumns: 2
			}, {
				width: 767,
				itemCount: 4,
				expectedColumns: 2
			}, {
				width: 991,
				itemCount: 0,
				expectedColumns: 3
			}, {
				width: 991,
				itemCount: 1,
				expectedColumns: 2
			}, {
				width: 991,
				itemCount: 2,
				expectedColumns: 2
			}, {
				width: 991,
				itemCount: 3,
				expectedColumns: 3
			}, {
				width: 991,
				itemCount: 4,
				expectedColumns: 2
			}, {
				width: 991,
				itemCount: 5,
				expectedColumns: 3
			}, {
				width: 992,
				itemCount: 0,
				expectedColumns: 4
			}, {
				width: 992,
				itemCount: 1,
				expectedColumns: 2
			}, {
				width: 992,
				itemCount: 2,
				expectedColumns: 2
			}, {
				width: 992,
				itemCount: 3,
				expectedColumns: 3
			}, {
				width: 992,
				itemCount: 4,
				expectedColumns: 4
			}, {
				width: 992,
				itemCount: 5,
				expectedColumns: 3
			}, {
				width: 992,
				itemCount: 6,
				expectedColumns: 3
			}, {
				width: 992,
				itemCount: 7,
				expectedColumns: 4
			}].forEach(function(scenario) {
				var description = 'width: ' + scenario.width + '; itemCount: ' + scenario.itemCount;
				var numberOfColumns = component._calcNumColumns(scenario.width, scenario.itemCount);
				expect(numberOfColumns, description).to.equal(scenario.expectedColumns);
			});
		});
	});
});
