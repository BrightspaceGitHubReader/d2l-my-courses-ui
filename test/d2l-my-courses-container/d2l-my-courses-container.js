import { EnrollmentCollectionEntity } from 'siren-sdk/src/enrollments/EnrollmentCollectionEntity.js';
import { PromotedSearchEntity } from 'siren-sdk/src/promotedSearch/PromotedSearchEntity.js';
import { UserSettingsEntity } from 'siren-sdk/src/userSettings/UserSettingsEntity';

describe('d2l-my-courses', () => {
	let component,
		clock,
		sandbox,
		searchAction,
		searchPinnedEnrollmentsAction,
		enrollmentsSearchResponse,
		promotedSearchResponse,
		promotedSearchMultipleResponse,
		lastSearchResponse;

	const enrollmentsHref = '/enrollments/users/169',
		promotedSearchHref = '/promoted-search-url',
		lastSearchHref = 'homepages/components/1/user-settings/169';

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

		component = fixture('d2l-my-courses-container-fixture');

		component.enrollmentsUrl = enrollmentsHref;
		component.promotedSearches = promotedSearchHref;
		component.userSettingsUrl = lastSearchHref;
		component.token = 'fake';

		component._userSettingsEntity = new UserSettingsEntity(lastSearchResponse);
		component._promotedSearchEntity = new PromotedSearchEntity(promotedSearchResponse);
		component._enrollmentCollectionEntity = new EnrollmentCollectionEntity(enrollmentsSearchResponse);
		component._changedCourseEnrollment = null;
	});

	afterEach(function() {
		if (clock) {
			clock.restore();
		}
		sandbox.restore();
	});

	it('should hide the only saved search action', () => {
		component._onPromotedSearchEntityChange();
		expect(component._tabSearchActions.length).to.equal(0);
	});

	it('should properly fetch default search data and hide the only saved search action', () => {
		component._enrollmentsSearchAction = searchAction;
		component._onPromotedSearchEntityChange();
		expect(component._tabSearchActions.length).to.equal(1);
	});

	it('should properly fetch saved search data with two saved search actions', () => {
		component._promotedSearchEntity = new PromotedSearchEntity(promotedSearchMultipleResponse);
		component._onPromotedSearchEntityChange();
		expect(component._tabSearchActions.length).to.equal(2);
		expect(component._tabSearchActions[0].selected).to.be.true;
	});

	it('should properly fetch default search data when set with two saved search actions', () => {
		component._promotedSearchEntity = new PromotedSearchEntity(promotedSearchMultipleResponse);
		component._enrollmentsSearchAction = searchAction;
		component._onPromotedSearchEntityChange();
		expect(component._tabSearchActions.length).to.equal(3);
		expect(component._tabSearchActions[1].selected).to.be.true;
	});

	it('should have search pinned enrollments action and hide the only saved search action', () => {
		component._enrollmentsSearchAction = searchAction;
		component._pinnedTabAction = searchPinnedEnrollmentsAction;
		component._onPromotedSearchEntityChange();
		expect(component._tabSearchActions.length).to.equal(2);
	});

	it('should have search pinned enrollments action with two saved search actions', () => {
		component._promotedSearchEntity = new PromotedSearchEntity(promotedSearchMultipleResponse);
		component._enrollmentsSearchAction = searchAction;
		component._pinnedTabAction = searchPinnedEnrollmentsAction;
		component._onPromotedSearchEntityChange();
		expect(component._tabSearchActions.length).to.equal(4);
		expect(component._tabSearchActions[2].selected).to.be.true;
	});

	[
		{ orgUnitId: 111, isPinned: true },
		{ orgUnitId: 222, isPinned: false }
	].forEach(testCase => {
		it(`should have updated _changedCourseEnrollment property based on the event of org ${testCase.orgUnitId}`, done => {
			const event = {
				detail: {
					orgUnitId: testCase.orgUnitId,
					isPinned: testCase.isPinned
				}
			};

			component._changedCourseEnrollment = null;
			requestAnimationFrame(() => {
				component._onCourseEnrollmentChange(event);
				expect(component._changedCourseEnrollment.orgUnitId).to.equal(testCase.orgUnitId);
				expect(component._changedCourseEnrollment.isPinned).to.equal(testCase.isPinned);
				done();
			});
		});
	});

	it('should have updated _currentTabId property based on the event', () => {
		component._currentTabId = null;
		const event = {
			detail: {
				tabId: 1254
			}
		};
		component._tabSelectedChanged(event);
		expect(component._currentTabId).to.equal(`panel-${event.detail.tabId}`);
	});

	describe('Public API', () => {

		describe('courseImageUploadCompleted', () => {
			it('should do nothing if image setting was not a success', done => {
				component._showGroupByTabs = false;
				flush(() => {
					const stub = sandbox.stub(component.shadowRoot.querySelector('d2l-my-courses-content'), 'refreshCardGridImages');
					component.courseImageUploadCompleted(false);
					expect(stub).to.not.have.been.called;
					done();
				});
			});
			it('should call refreshCardGridImages on the content (not grouped by tab)', done => {
				component._showGroupByTabs = false;
				flush(() => {
					const stub = sandbox.stub(component.shadowRoot.querySelector('d2l-my-courses-content'), 'refreshCardGridImages');
					component.courseImageUploadCompleted(true);
					expect(stub).to.have.been.called;
					done();
				});
			});
			it('should call refreshCardGridImages on the content (grouped by tab)', done => {
				component._promotedSearchEntity = new PromotedSearchEntity(promotedSearchMultipleResponse);
				component._onPromotedSearchEntityChange();
				component._currentTabId = '6607';
				flush(() => {
					const stub = sandbox.stub(component.shadowRoot.querySelector('d2l-my-courses-content'), 'refreshCardGridImages');
					component.courseImageUploadCompleted(true);
					expect(stub).to.have.been.called;
					done();
				});
			});
		});

		describe('getLastOrgUnitId', () => {
			it('should call getOrgUnitIdFromHref (not grouped by tab)', done => {
				component._showGroupByTabs = false;
				component._setImageOrg.links = [];
				flush(() => {
					const stub1 = sandbox.stub(component, 'getOrgUnitIdFromHref');
					const stub2 = sandbox.stub(component, 'getEntityIdentifier');
					component.getLastOrgUnitId();
					expect(stub1).to.have.been.called;
					expect(stub2).to.have.been.called;
					done();
				});
			});

			it('should call getOrgUnitIdFromHref (grouped by tab)', done => {
				component._promotedSearchEntity = new PromotedSearchEntity(promotedSearchMultipleResponse);
				component._onPromotedSearchEntityChange();
				component._currentTabId = '6607';
				component._setImageOrg.links = [];
				flush(() => {
					const stub1 = sandbox.stub(component, 'getOrgUnitIdFromHref');
					const stub2 = sandbox.stub(component, 'getEntityIdentifier');
					component.getLastOrgUnitId();
					expect(stub1).to.have.been.called;
					expect(stub2).to.have.been.called;
					done();
				});
			});
		});
	});

	describe('Alerts', function() {
		it('should remove the course image failure alert before determining if it needs to add it back', function() {
			component._showImageError = true;
			component._onSetCourseImage();
			expect(component._showImageError).to.be.false;
		});

		it('should add the course image alert after receiving a failure result (after a timeout)', function() {
			clock = sinon.useFakeTimers();
			const setCourseImageEvent = { detail: { status: 'failure'} };
			component._onSetCourseImage(setCourseImageEvent);
			clock.tick(1001);
			expect(component._showImageError).to.be.true;
		});

		it('should not add a course image failure alert when a request to set the image succeeds', function() {
			const setCourseImageEvent = { detail: { status: 'success'} };
			component._onSetCourseImage(setCourseImageEvent);
			expect(component._showImageError).to.be.false;
		});

		it('should remove a course image failure alert when a request to set the image is made', function() {
			clock = sinon.useFakeTimers();
			let setCourseImageEvent = { detail: { status: 'failure'} };
			component._onSetCourseImage(setCourseImageEvent);
			clock.tick(1001);
			expect(component._showImageError).to.be.true;
			setCourseImageEvent = { detail: { status: 'set'} };
			component._onSetCourseImage(setCourseImageEvent);
			expect(component._showImageError).to.be.false;
		});
	});

	describe('Events', function() {
		beforeEach(done => {
			setTimeout(() => {
				done();
			});
		});
		describe('open-change-image-view', () => {
			let event,
				fetchStub;

			beforeEach(() => {
				// Prevents the _searchPath of the image selector from being null
				component.imageCatalogLocation = '/foo';
				fetchStub = sandbox.stub(window.D2L.Siren.EntityStore, 'fetch');
				fetchStub.withArgs('/foo', sinon.match.string).returns(Promise.resolve({entity: {}}));
				event = new CustomEvent('open-change-image-view', {
					detail: {
						organization: window.D2L.Hypermedia.Siren.Parse({
							properties: {
								name: 'Course One'
							},
							links: [{
								rel: ['self'],
								href: '/organizations/1'
							}]
						})
					}
				});
			});

			it('should update _setImageOrg', done => {

				component.addEventListener('open-change-image-view', function() {
					expect(component._setImageOrg.properties.name).to.equal('Course One');
					done();
				});

				component.dispatchEvent(event);

			});

			it('should open the course image overlay', done => {
				const spy = sandbox.spy(component.$['basic-image-selector-overlay'], 'open');

				component.addEventListener('open-change-image-view', function() {
					requestAnimationFrame(() => {
						expect(spy).to.have.been.called;
						done();
					});
				});

				component.dispatchEvent(event);

			});

			it('should return undefined for org unit id initally', () => {
				expect(component.getLastOrgUnitId()).to.equal(undefined);
			});

			it('should return correct org unit id if course tile used', done => {

				component.addEventListener('open-change-image-view', function() {
					requestAnimationFrame(() => {
						expect(component.getLastOrgUnitId()).to.equal('1');
						done();
					});
				});

				requestAnimationFrame(() => {
					component.dispatchEvent(event);
				});
			});

			it('should return correct org unit id from various href', () => {
				expect(component.getOrgUnitIdFromHref('/organizations/671')).to.equal('671');
				expect(component.getOrgUnitIdFromHref('/some/other/route/8798734534')).to.equal('8798734534');
			});

		});

		describe('clear-image-scroll-threshold', () => {

			it('should clear triggers on the image-selector-threshold', (done) => {
				flush(() => {
					const threshold = component.shadowRoot.querySelector('#image-selector-threshold');
					const spy = sandbox.spy(threshold, 'clearTriggers');

					const event = new CustomEvent('clear-image-scroll-threshold');
					component.dispatchEvent(event);
					requestAnimationFrame(() => {
						expect(spy).to.have.been.calledOnce;
						done();
					});
				});

			});

		});

		describe('set-course-image', () => {

			it('should close the image-selector overlay', done => {
				const spy = sandbox.spy(component.$['basic-image-selector-overlay'], 'close');

				const event = new CustomEvent('set-course-image');
				component.dispatchEvent(event);

				setTimeout(() => {
					expect(spy).to.have.been.called;
					done();
				});
			});
		});

		describe('d2l-course-pinned-change', () => {
			let _enrollmentEntity,
				event;

			beforeEach(() => {
				_enrollmentEntity = {
					_entity: {},
					organizationHref: function() { return '1234'; },
				};

				event = new CustomEvent('d2l-course-pinned-change', {
					detail: {
						isPinned: true,
						enrollment: _enrollmentEntity
					}
				});

				component._enrollmentsSearchAction = searchAction;
				component._onPromotedSearchEntityChange();
			});

			[
				{ },
				{orgUnitId: '1234', isPinned: false },
				{orgUnitId: '5678', isPinned: true }
			].forEach(initialChangedCourseEnrollment => {
				it(`should update the _changedCourseEnrollment property from ${JSON.stringify(initialChangedCourseEnrollment)}, and pass this to d2l-my-courses-content`, () => {
					const stub = sandbox.stub(component._fetchContentComponent(), 'courseEnrollmentChanged');

					component._changedCourseEnrollment = initialChangedCourseEnrollment;
					component._onCourseEnrollmentChange(event);

					expect(component._changedCourseEnrollment.orgUnitId).to.equal('1234');
					expect(component._changedCourseEnrollment.isPinned).to.equal(true);
					expect(stub).to.have.been.called;
				});
			});

			it('should not update the _changedCourseEnrollment property if nothing has changed', () => {
				const stub = sandbox.stub(component._fetchContentComponent(), 'courseEnrollmentChanged');
				component._changedCourseEnrollment = {
					orgUnitId: '1234',
					isPinned: true,
					didNotReplaceObject: true
				};

				component._onCourseEnrollmentChange(event);

				expect(component._changedCourseEnrollment.orgUnitId).to.equal('1234');
				expect(component._changedCourseEnrollment.isPinned).to.equal(true);
				expect(component._changedCourseEnrollment.didNotReplaceObject).to.equal(true);
				expect(stub).not.to.have.been.called;
			});

		});
	});
});
