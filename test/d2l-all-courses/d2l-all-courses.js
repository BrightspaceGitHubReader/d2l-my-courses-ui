import { flush } from '@polymer/polymer/lib/utils/render-status.js';

describe('d2l-all-courses', function() {
	let widget,
		clock,
		sandbox;

	function fireEvent(component, eventName, detail) {
		component.dispatchEvent(
			new CustomEvent(eventName, {
				bubbles: true,
				composed: true,
				detail: detail
			})
		);
	}

	beforeEach(function(done) {
		sandbox = sinon.sandbox.create();

		widget = fixture('d2l-all-courses-fixture');
		widget.$['search-widget']._setSearchUrl = sandbox.stub();
		widget._enrollmentsSearchAction = {
			name: 'search-my-enrollments',
			href: '/enrollments/users/169',
			fields: [{
				name: 'parentOrganizations',
				value: ''
			}, {
				name: 'sort',
				value: ''
			}]
		};

		flush();
		requestAnimationFrame(() => {
			done();
		});
	});

	afterEach(function() {
		if (clock) {
			clock.restore();
		}
		sandbox.restore();
	});

	describe('loading spinner', function() {
		it('should show before content has loaded', function() {
			expect(widget.shadowRoot.querySelector('d2l-loading-spinner:not(#lazyLoadSpinner)').hasAttribute('hidden')).to.be.false;
		});
	});

	describe('advanced search link', function() {
		it('should not render when advancedSearchUrl is not set', function() {
			widget.advancedSearchUrl = null;

			expect(widget._showAdvancedSearchLink).to.be.false;
			expect(widget.shadowRoot.querySelector('.advanced-search-link').hasAttribute('hidden')).to.be.true;
		});

		it('should render when advancedSearchUrl is set', function() {
			widget.advancedSearchUrl = '/test/url';

			expect(widget._showAdvancedSearchLink).to.be.true;
			expect(widget.shadowRoot.querySelector('.advanced-search-link').hasAttribute('hidden')).to.be.false;
		});
	});

	describe('filter menu', function() {
		it('should load filter menu content when filter menu is opened', function() {
			const semestersTabStub = sandbox.stub(widget.$.filterMenu.$.semestersTab, 'load');
			const departmentsTabStub = sandbox.stub(widget.$.filterMenu.$.departmentsTab, 'load');

			return widget._onFilterDropdownOpen().then(function() {
				expect(semestersTabStub.called).to.be.true;
				expect(departmentsTabStub.called).to.be.true;
			});
		});
	});

	describe('opening the overlay', function() {
		it('should initially hide content', function() {
			widget.open();
			expect(widget._showContent).to.be.false;
		});
	});

	describe('Alerts', function() {
		it('should show and hide the course image failure alert depending on the value of showImageError', function() {
			const alertMessage = 'Sorry, we\'re unable to change your image right now. Please try again later.';
			widget.showImageError = true;

			const alert = widget.shadowRoot.querySelector('d2l-alert');
			expect(alert.hidden).to.be.false;
			expect(alert.type).to.equal('warning');
			expect(alert.innerText).to.include(alertMessage);
			widget.showImageError = false;
			expect(alert.hidden).to.be.true;
		});
	});

	describe('d2l-filter-menu-change event', function() {
		beforeEach(done => {
			flush();
			requestAnimationFrame(() => {
				done();
			});
		});
		it('should set the _searchUrl with one query string and filterCounts', function(done) {
			fireEvent(widget.$.filterMenu, 'd2l-filter-menu-change', {
				url: 'http://example.com',
				filterCounts: {
					departments: 12,
					semesters: 0,
					roles: 0
				}
			});
			requestAnimationFrame(() => {
				expect(widget._searchUrl.indexOf('http://example.com?bustCache') !== -1).to.be.true;
				expect(widget._totalFilterCount).to.equal(12);
				done();
			});
		});

		it('should set the _searchUrl with multiple query strings and filterCounts', function(done) {
			fireEvent(widget.$.filterMenu, 'd2l-filter-menu-change', {
				url: 'http://example.com?search=&pageSize=20',
				filterCounts: {
					departments: 15,
					semesters: 0,
					roles: 0
				}
			});
			requestAnimationFrame(() => {
				expect(widget._searchUrl.indexOf('http://example.com?search=&pageSize=20&bustCache=') !== -1).to.be.true;
				expect(widget._totalFilterCount).to.equal(15);
				done();
			});
		});
	});

	describe('d2l-menu-item-change event', function() {
		it('should set the _searchUrl', function() {
			fireEvent(widget.$.sortDropdown, 'd2l-menu-item-change', {
				value: 'LastAccessed'
			});

			expect(widget._searchUrl).to.include('/enrollments/users/169?parentOrganizations=&sort=LastAccessed');
		});

	});

	describe('Filter text', function() {
		function fireEvents(filterCount) {
			fireEvent(widget.$.filterMenu, 'd2l-filter-menu-change', {
				url: 'http://example.com',
				filterCounts: {
					departments: filterCount,
					semesters: 0,
					roles: 0
				}
			});
			fireEvent(widget.$.filterDropdownContent, 'd2l-dropdown-close');
		}

		it('should read "Filter" when no filters are selected', function() {
			fireEvents(0);
			expect(widget._filterText).to.equal('Filter');
		});

		it('should read "Filter: 1 filter" when any 1 filter is selected', function() {
			fireEvents(1);
			expect(widget._filterText).to.equal('Filter: 1 Filter');
		});

		it('should read "Filter: 2 filters" when any 2 filters are selected', function() {
			fireEvents(2);
			expect(widget._filterText).to.equal('Filter: 2 Filters');
		});
	});

	describe('Info Message', function() {

		describe('changing enrollment entities', function() {
			[
				{ _isSearched: true, _totalFilterCount: 0, enrollmentsLength: 0, expectedMessage: 'noCoursesInSearch', hideMessage: false },
				{ _isSearched: true, _totalFilterCount: 0, enrollmentsLength: 3, expectedMessage: null, hideMessage: true },
				{ _isSearched: false, _totalFilterCount: 2, enrollmentsLength: 0, expectedMessage: 'noCoursesInSelection', hideMessage: false }
			].forEach(testCase => {
				it(`should set _infoMessageText to ${testCase.expectedMessage} and ${testCase.hideMessage ? 'hide' : 'show'} the message when enrollments length is ${testCase.enrollmentsLength}, _isSearched is ${testCase._isSearched} and _totalFilterCount is ${testCase._totalFilterCount}`, () => {
					widget._isSearched = testCase._isSearched;
					widget._totalFilterCount = testCase._totalFilterCount;
					widget._updateInfoMessage(testCase.enrollmentsLength);

					expect(widget._infoMessageText).to.equal(widget.localize(testCase.expectedMessage) ? widget.localize(testCase.expectedMessage) : null);
					expect(widget.shadowRoot.querySelector('#infoMessage').hidden).to.equal(testCase.hideMessage);
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
					widget._isSearched = false;
					widget._totalFilterCount = 1;
					widget._filterCounts = {};
					widget._filterCounts[testCase.filter] = 1;
					widget._updateInfoMessage(0);

					expect(widget._infoMessageText).to.equal(widget.localize(testCase.expectedMessage));
					expect(widget.shadowRoot.querySelector('#infoMessage').hidden).to.be.false;
				});
			});

			[
				{ filter: 'departments' },
				{ filter: 'semesters' },
				{ filter: 'roles' }
			].forEach(testCase => {
				it(`should set _infoMessageText to catch-all langterm when there are no enrollments and more than one ${testCase.filter} are filtered`, () => {
					widget._isSearched = false;
					widget._totalFilterCount = 3;
					widget._filterCounts = {};
					widget._filterCounts[testCase.filter] = 3;
					widget._updateInfoMessage(0);

					expect(widget._infoMessageText).to.equal(widget.localize('noCoursesInSelection'));
					expect(widget.shadowRoot.querySelector('#infoMessage').hidden).to.be.false;
				});
			});

			it('should set _infoMessageText to catch-all langterm when there are more than one filters', () => {
				widget._isSearched = false;
				widget._totalFilterCount = 4;
				widget._filterCounts = {};
				widget._updateInfoMessage(0);

				expect(widget._infoMessageText).to.equal(widget.localize('noCoursesInSelection'));
				expect(widget.shadowRoot.querySelector('#infoMessage').hidden).to.be.false;
			});
		});
	});

	describe('closing the overlay', function() {

		it('should clear search text', function() {
			const spy = sandbox.spy(widget, '_clearSearchWidget');
			const searchField = widget.$['search-widget'];

			searchField._getSearchWidget()._getSearchInput().value = 'foo';
			widget.shadowRoot.querySelector('d2l-simple-overlay')._renderOpened();
			expect(spy.called).to.be.true;
			expect(searchField._getSearchWidget()._getSearchInput().value).to.equal('');
		});

		it('should clear filters', function() {
			const spy = sandbox.spy(widget.$.filterMenu, 'clearFilters');

			fireEvent(widget.$.filterMenu, 'd2l-filter-menu-change', {
				filterCounts: {
					departments: 1,
					semesters: 0,
					roles: 0
				}
			});
			fireEvent(widget.$.filterDropdownContent, 'd2l-dropdown-close', {});

			expect(widget._filterText).to.equal('Filter: 1 Filter');
			widget.shadowRoot.querySelector('d2l-simple-overlay')._renderOpened();
			expect(spy.called).to.be.true;
			expect(widget._filterText).to.equal('Filter');
		});

		it('should clear sort', function() {
			const spy = sandbox.spy(widget, '_resetSortDropdown');

			const event = {
				selected: true,
				value: 'OrgUnitCode'
			};

			widget.load();
			fireEvent(widget.shadowRoot.querySelector('d2l-dropdown-menu'), 'd2l-menu-item-change', event);
			expect(widget._searchUrl).to.contain('OrgUnitCode,OrgUnitId');

			widget.shadowRoot.querySelector('d2l-simple-overlay')._renderOpened();
			expect(spy.called).to.be.true;
		});

	});

	describe('Tabbed view', function() {
		beforeEach(function(done) {
			widget.updatedSortLogic = true;
			widget.tabSearchActions = [{
				name: '12345',
				title: 'Search Foo Action',
				selected: false,
				enrollmentsSearchAction: {
					name: 'search-foo',
					href: '/example/foo',
					fields: [{
						name: 'autoPinCourses',
						value: true
					}, {
						name: 'embedDepth',
						value: 0
					}, {
						name: 'sort',
						value: 'foobar'
					}, {
						name: 'search',
						value: ''
					}]
				}
			}];
			widget._enrollmentsSearchAction.getFieldByName = sandbox.stub();
			flush();
			requestAnimationFrame(() => {
				done();
			});
		});

		it('should hide tab contents when loading a tab\'s contents', function() {
			widget._showTabContent = true;

			widget.dispatchEvent(new CustomEvent(
				'd2l-tab-panel-selected', { bubbles: true, composed: true }
			));

			expect(widget._showTabContent).to.be.false;
		});

		it('should set the _searchUrl based on the selected tab\'s action', function() {

			widget.dispatchEvent(new CustomEvent(
				'd2l-tab-panel-selected', { bubbles: true, composed: true }
			));
			expect(widget._searchUrl.indexOf('/example/foo?autoPinCourses=false&embedDepth=0&sort=Current&search=&bustCache=') !== -1).to.be.true;
		});
	});

});
