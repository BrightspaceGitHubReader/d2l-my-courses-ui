describe('d2l-all-courses-content', function() {
	let widget, sandbox;

	beforeEach(function(done) {
		sandbox = sinon.sandbox.create();
		widget = fixture('d2l-all-courses-content-fixture');

		setTimeout(function() {
			done();
		});
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('changing enrollment entities', function() {
		[
			{ isSearched: true, totalFilterCount: 0, enrollmentsLength: 0, expectedMessage: 'noCoursesInSearch', hideMessage: false },
			{ isSearched: true, totalFilterCount: 0, enrollmentsLength: 3, expectedMessage: null, hideMessage: true },
			{ isSearched: false, totalFilterCount: 2, enrollmentsLength: 0, expectedMessage: 'noCoursesInSelection', hideMessage: false }
		].forEach(testCase => {
			it(`should set _infoMessageText to ${testCase.expectedMessage} and ${testCase.hideMessage ? 'hide' : 'show'} the message when enrollments length is ${testCase.enrollmentsLength}, isSearched is ${testCase.isSearched} and totalFilterCount is ${testCase.totalFilterCount}`, () => {
				widget.isSearched = testCase.isSearched;
				widget.totalFilterCount = testCase.totalFilterCount;
				widget._enrollmentsChanged(testCase.enrollmentsLength);

				expect(widget._infoMessageText).to.equal(widget.localize(testCase.expectedMessage) ? widget.localize(testCase.expectedMessage) : null);
				expect(widget.shadowRoot.querySelector('span').hidden).to.equal(testCase.hideMessage);
			});
		});
	});

	describe('filtering when there are no courses', () => {
		[
			{ expectedMessage: 'noCoursesInDepartment', filter: 'departments' },
			{ expectedMessage: 'noCoursesInSemester', filter: 'semesters' },
			{ expectedMessage: 'noCoursesInRole', filter: 'roles' }
		].forEach(testCase => {
			it(`should set _infoMessageText to ${testCase.expectedMessage} when there are no enrollments and one ${testCase.filter} is filtered`, () => {
				widget.isSearched = false;
				widget.totalFilterCount = 1;
				widget.filterCounts = {};
				widget.filterCounts[testCase.filter] = 1;
				widget._enrollmentsChanged(0);
				expect(widget._infoMessageText).to.equal(widget.localize(testCase.expectedMessage));
				expect(widget.shadowRoot.querySelector('span').hidden).to.be.false;
			});
		});

		[
			{ filter: 'departments' },
			{ filter: 'semesters' },
			{ filter: 'roles' }
		].forEach(testCase => {
			it(`should set _infoMessageText to catch-all langterm when there are no enrollments and more than one ${testCase.filter} are filtered`, () => {
				widget.isSearched = false;
				widget.totalFilterCount = 3;
				widget.filterCounts = {};
				widget.filterCounts[testCase.filter] = 3;
				widget._enrollmentsChanged(0);
				expect(widget._infoMessageText).to.equal(widget.localize('noCoursesInSelection'));
				expect(widget.shadowRoot.querySelector('span').hidden).to.be.false;
			});
		});

		it('should set _infoMessageText to catch-all langterm when there are more than one filters', () => {
			widget.isSearched = false;
			widget.totalFilterCount = 4;
			widget.filterCounts = {};
			widget._enrollmentsChanged(0);
			expect(widget._infoMessageText).to.equal(widget.localize('noCoursesInSelection'));
			expect(widget.shadowRoot.querySelector('span').hidden).to.be.false;
		});
	});
});
