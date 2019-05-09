describe('d2l-my-courses', () => {
	var component,
		sandbox,
		fetchStub,
		enrollmentsHref = '/enrollments/users/169',
		promotedSearchHref = '/promoted-search-url',
		promotedSearchHrefMultiple = '/promoted-search-multiple-url',
		lastSearchHref = 'homepages/components/1/user-settings/169',
		searchAction,
		searchPinnedEnrollmentsAction,
		enrollmentsSearchResponse,
		promotedSearchResponse,
		promotedSearchMultipleResponse,
		lastSearchResponse;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		searchAction = {
			name: 'search-my-enrollments',
			method: 'GET',
			href: enrollmentsHref,
			fields: [
				{ name: 'search', type: 'search', value: '' },
				{ name: 'pageSize', type: 'number', value: 20 },
				{ name: 'embedDepth', type: 'number', value: 0 },
				{ name: 'sort', type: 'text', value: 'current' },
				{ name: 'autoPinCourses', type: 'checkbox', value: false },
				{ name: 'promotePins', type: 'checkbox', value: false }
			]
		},
		searchPinnedEnrollmentsAction = {
			name: 'search-my-pinned-enrollments',
			method: 'GET',
			href: enrollmentsHref,
			fields: [
				{ name: 'search', type: 'search', value: '' },
				{ name: 'pageSize', type: 'number', value: 20 },
				{ name: 'embedDepth', type: 'number', value: 0 },
				{ name: 'sort', type: 'text', value: 'current' },
				{ name: 'autoPinCourses', type: 'checkbox', value: false },
				{ name: 'promotePins', type: 'checkbox', value: false }
			]
		},
		enrollmentsSearchResponse = window.D2L.Hypermedia.Siren.Parse({
			actions: [searchAction],
		}),
		promotedSearchResponse = window.D2L.Hypermedia.Siren.Parse({
			actions: [
				{
					title: 'Department 1',
					href: '/enrollments/users/169',
					name: '6604',
					method: 'GET',
					fields: [
						{ name: 'search', type: 'search', value: '' },
						{ name: 'pageSize', type: 'number', value: 20 },
						{ name: 'embedDepth', type: 'number', value: 0 },
						{ name: 'sort', type: 'text', value: 'current' },
						{ name: 'autoPinCourses', type: 'checkbox', value: false },
						{ name: 'promotePins', type: 'checkbox', value: false },
						{ name: 'orgUnitTypeId', type: 'hidden', value: 3 }
					]
				}
			]
		}),
		promotedSearchMultipleResponse = window.D2L.Hypermedia.Siren.Parse({
			actions: [
				{
					title: 'Semester 1',
					href: '/enrollments/users/169',
					name: '6607',
					method: 'GET',
					fields: [
						{ name: 'search', type: 'search', value: '' },
						{ name: 'pageSize', type: 'number', value: 20 },
						{ name: 'embedDepth', type: 'number', value: 0 },
						{ name: 'sort', type: 'text', value: 'current' },
						{ name: 'autoPinCourses', type: 'checkbox', value: false },
						{ name: 'promotePins', type: 'checkbox', value: false },
						{ name: 'orgUnitTypeId', type: 'hidden', value: 3 }
					]
				},
				{
					title: 'Semester 2',
					href: '/enrollments/users/169',
					name: '6609',
					method: 'GET',
					fields: [
						{ name: 'search', type: 'search', value: '' },
						{ name: 'pageSize', type: 'number', value: 20 },
						{ name: 'embedDepth', type: 'number', value: 0 },
						{ name: 'sort', type: 'text', value: 'current' },
						{ name: 'autoPinCourses', type: 'checkbox', value: false },
						{ name: 'promotePins', type: 'checkbox', value: false },
						{ name: 'orgUnitTypeId', type: 'hidden', value: 3 }
					]
				}
			]
		}),
		lastSearchResponse = window.D2L.Hypermedia.Siren.Parse({
			properties: {
				MostRecentEnrollmentsSearchType: 0,
				MostRecentEnrollmentsSearchName: '6607'
			}
		});

		component = fixture('d2l-my-courses-legacy-fixture');

		fetchStub = sandbox.stub(window.D2L.Siren.EntityStore, 'fetch');
		SetupFetchStub(enrollmentsHref, enrollmentsSearchResponse);
		SetupFetchStub(lastSearchHref, lastSearchResponse);
		SetupFetchStub(promotedSearchHref, promotedSearchResponse);
		SetupFetchStub(promotedSearchHrefMultiple, promotedSearchMultipleResponse);

		component.enrollmentsUrl = enrollmentsHref;
		component.promotedSearches = promotedSearchHref;
		component.userSettingsUrl = lastSearchHref;
		component.token = 'fake';
	});

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match(url), sinon.match.string)
			.returns(Promise.resolve({entity: entity}));
	}

	afterEach(() => {
		sandbox.restore();
	});

	it('should properly implement the d2l-my-courses-behavior', () => {
		expect(component.courseImageUploadCompleted).to.be.a('function');
		expect(component.getLastOrgUnitId).to.be.a('function');
		expect(component.updatedSortLogic).to.equal(false);
	});

	it('should hide the only saved search action', () => {
		return component._fetchTabSearchActions()
			.then(function() {
				expect(fetchStub).to.be.called;
				expect(component._tabSearchActions.length).to.equal(0);
			});
	});

	it('should properly fetch default search data and hide the only saved search action', () => {
		component._enrollmentsSearchAction = searchAction;
		return component._fetchTabSearchActions()
			.then(function() {
				expect(fetchStub).to.be.called;
				expect(component._tabSearchActions.length).to.equal(1);
			});
	});

	it('should properly fetch saved search data with two saved search actions', () => {
		component.promotedSearches = promotedSearchHrefMultiple;
		return component._fetchTabSearchActions()
			.then(function() {
				expect(fetchStub).to.be.called;
				expect(component._tabSearchActions.length).to.equal(2);
				expect(component._tabSearchActions[0].selected).to.be.true;
			});
	});

	it('should properly fetch default search data when set with two saved search actions', () => {
		component.promotedSearches = promotedSearchHrefMultiple;
		component._enrollmentsSearchAction = searchAction;
		return component._fetchTabSearchActions()
			.then(function() {
				expect(fetchStub).to.be.called;
				expect(component._tabSearchActions.length).to.equal(3);
				expect(component._tabSearchActions[1].selected).to.be.true;
			});
	});

	it('should have search pinned enrollments action and hide the only saved search action', () => {
		component._enrollmentsSearchAction = searchAction;
		component._pinnedTabAction = searchPinnedEnrollmentsAction;
		return component._fetchTabSearchActions()
			.then(function() {
				expect(fetchStub).to.be.called;
				expect(component._tabSearchActions.length).to.equal(2);
			});
	});

	it('should have search pinned enrollments action with two saved search actions', () => {
		component.promotedSearches = promotedSearchHrefMultiple;
		component._enrollmentsSearchAction = searchAction;
		component._pinnedTabAction = searchPinnedEnrollmentsAction;
		return component._fetchTabSearchActions()
			.then(function() {
				expect(fetchStub).to.be.called;
				expect(component._tabSearchActions.length).to.equal(4);
				expect(component._tabSearchActions[2].selected).to.be.true;
			});
	});

	describe('Listener setup', () => {
		[
			{ eventName: 'd2l-course-enrollment-change', handler: '_onCourseEnrollmentChange' },
			{ eventName: 'd2l-tab-changed', handler: '_tabSelectedChanged' },
		].forEach(testCase => {

			it('should listen for ' + testCase.eventName + ' events', done => {
				var stub = sandbox.stub(component, testCase.handler);

				var event = new CustomEvent(testCase.eventName);
				component.dispatchEvent(event);

				setTimeout(() => {
					expect(stub).to.have.been.called;
					done();
				});
			});
		});
	});

	it('should have updated _changedCourseEnrollment property based on the event', () => {
		[
			{ orgUnitId: 111, isPinned: true },
			{ orgUnitId: 222, isPinned: false },
		].forEach(testCase => {
			var event = {
				detail: {
					orgUnitId: testCase.orgUnitId,
					isPinned: testCase.isPinned
				}
			};

			component._changedCourseEnrollment = null;
			component._onCourseEnrollmentChange(event);
			expect(component._changedCourseEnrollment.orgUnitId).to.equal(testCase.orgUnitId);
			expect(component._changedCourseEnrollment.isPinned).to.equal(testCase.isPinned);
		});
	});

	it('should have updated currentTabId proprety based on thge event', () => {
		component.currentTabId = null;
		var event = {
			detail: {
				tabId: 1254
			}
		};
		component._tabSelectedChanged(event);
		expect(component.currentTabId).to.equal(`panel-${event.detail.tabId}`);
	});

	describe('Public API', () => {
		it('should call d2l-my-courses-content-animated.courseImageUploadCompleted', done => {
			component.updatedSortLogic = false;
			flush(() => {
				var stub = sandbox.stub(component.$$('d2l-my-courses-content-animated'), 'courseImageUploadCompleted');
				component.courseImageUploadCompleted();
				expect(stub).to.have.been.called;
				done();
			});
		});

		it('should call d2l-my-courses-content-animated.getLastOrgUnitId', done => {
			component.updatedSortLogic = false;
			flush(() => {
				var stub = sandbox.stub(component.$$('d2l-my-courses-content-animated'), 'getLastOrgUnitId');
				component.getLastOrgUnitId();
				expect(stub).to.have.been.called;
				done();
			});
		});
	});
});
