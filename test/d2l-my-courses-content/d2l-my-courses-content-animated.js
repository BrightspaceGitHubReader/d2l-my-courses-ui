describe('d2l-my-courses-content-animated', function() {
	var sandbox,
		widget,
		fetchStub,
		organization = {
			links: [{
				rel: ['self'],
				href: '/organizations/1'
			}]
		},
		searchHref = '/enrollments/users/169',
		searchAction = {
			name: 'search-my-enrollments',
			method: 'GET',
			href: searchHref,
			fields: [{
				name: 'search',
				type: 'search',
				value: ''
			}, {
				name: 'pageSize',
				type: 'number',
				value: 20
			}, {
				name: 'embedDepth',
				type: 'number',
				value: 0
			}, {
				name: 'sort',
				type: 'text',
				value: ''
			}, {
				name: 'autoPinCourses',
				type: 'checkbox',
				value: false
			}]
		},
		enrollmentsSearchResponse = {
			actions: [searchAction],
			entities: [{
				class: ['pinned', 'enrollment'],
				rel: ['https://api.brightspace.com/rels/user-enrollment'],
				actions: [{
					name: 'unpin-course',
					method: 'PUT',
					href: '/enrollments/users/169/organizations/1',
					fields: [{
						name: 'pinned',
						type: 'hidden',
						value: false
					}]
				}],
				links: [{
					rel: ['https://api.brightspace.com/rels/organization'],
					href: '/organizations/1'
				}, {
					rel: ['self'],
					href: '/enrollments/users/169/organizations/1'
				}]
			}, {
				class: ['pinned', 'enrollment'],
				rel: ['https://api.brightspace.com/rels/user-enrollment'],
				actions: [{
					name: 'unpin-course',
					method: 'PUT',
					href: '/enrollments/users/169/organizations/2',
					fields: [{
						name: 'pinned',
						type: 'hidden',
						value: false
					}]
				}],
				links: [{
					rel: ['https://api.brightspace.com/rels/organization'],
					href: '/organizations/2'
				}, {
					rel: ['self'],
					href: '/enrollments/users/169/organizations/2'
				}]
			}],
			links: [{
				rel: ['self'],
				href: searchHref
			}]
		},
		enrollment1Pinned = {
			class: ['unpinned', 'enrollment'],
			rel: ['https://api.brightspace.com/rels/user-enrollment'],
			actions: [{
				name: 'pin-course',
				method: 'PUT',
				href: '/enrollments/users/169/organizations/1',
				fields: [{
					name: 'pinned',
					type: 'hidden',
					value: true
				}]
			}],
			links: [{
				rel: ['https://api.brightspace.com/rels/organization'],
				href: '/organizations/1'
			}, {
				rel: ['self'],
				href: '/enrollments/users/169/organizations/1'
			}]
		},
		enrollment1Unpinned = {
			class: ['unpinned', 'enrollment'],
			rel: ['https://api.brightspace.com/rels/user-enrollment'],
			actions: [{
				name: 'pin-course',
				method: 'PUT',
				href: '/enrollments/users/169/organizations/1',
				fields: [{
					name: 'pinned',
					type: 'hidden',
					value: true
				}]
			}],
			links: [{
				rel: ['https://api.brightspace.com/rels/organization'],
				href: '/organizations/1'
			}, {
				rel: ['self'],
				href: '/enrollments/users/169/organizations/1'
			}]
		},
		enrollment2Pinned = {
			class: ['pinned', 'enrollment'],
			rel: ['https://api.brightspace.com/rels/user-enrollment'],
			actions: [{
				name: 'unpin-course',
				method: 'PUT',
				href: '/enrollments/users/169/organizations/2',
				fields: [{
					name: 'pinned',
					type: 'hidden',
					value: false
				}]
			}],
			links: [{
				rel: ['https://api.brightspace.com/rels/organization'],
				href: '/organizations/2'
			}, {
				rel: ['self'],
				href: '/enrollments/users/169/organizations/2'
			}]
		},
		enrollmentsSearchResponseOneUnpinned = {
			actions: [searchAction],
			entities: [enrollment1Pinned, enrollment2Pinned],
			links: [{
				rel: ['self'],
				href: searchHref
			}]
		},
		enrollmentsNextPageSearchResponse = {
			entities: [{
				class: ['unpinned', 'enrollment'],
				rel: ['https://api.brightspace.com/rels/user-enrollment'],
				actions: [{
					name: 'unpin-course',
					method: 'PUT',
					href: '/enrollments/users/169/organizations/2',
					fields: [{
						name: 'pinned',
						type: 'hidden',
						value: false
					}]
				}],
				links: [{
					rel: ['https://api.brightspace.com/rels/organization'],
					href: '/organizations/2'
				}, {
					rel: ['self'],
					href: '/enrollments/users/169/organizations/2'
				}]
			}],
			links: [{
				rel: ['self'],
				href: searchHref
			}]
		},
		noEnrollmentsResponse = {
			entities: []
		},
		noPinnedEnrollmentsResponse = {
			entities: [enrollment1Unpinned],
			links: [{
				rel: ['self'],
				href: searchHref
			}]
		},
		organizationEntity = {
			properties: {
				name: 'Course One'
			},
			links: [{
				rel: ['self'],
				href: '/organizations/1'
			}]
		},
		enrollmentsSearchEntity,
		clock;

	function SetupFetchStub(url, entity) {
		fetchStub.withArgs(sinon.match(url), sinon.match.string)
			.returns(Promise.resolve({entity: entity}));
	}

	beforeEach(function(done) {
		enrollmentsSearchEntity = window.D2L.Hypermedia.Siren.Parse(enrollmentsSearchResponse);
		organizationEntity = window.D2L.Hypermedia.Siren.Parse(organizationEntity);
		sandbox = sinon.sandbox.create();

		fetchStub = sandbox.stub(window.D2L.Siren.EntityStore, 'fetch');
		SetupFetchStub(/\/organizations\/1\?embedDepth=1$/, organizationEntity);
		SetupFetchStub(/\/organizations\/2\?embedDepth=1$/, organizationEntity);
		widget = fixture('d2l-my-courses-content-animated-fixture');
		widget.token = 'a1';

		setTimeout(() => {
			done();
		});
	});

	afterEach(function() {
		if (clock) {
			clock.restore();
		}

		sandbox.restore();
	});

	it('should load', function() {
		SetupFetchStub(/\/enrollments\/users\/169\?search=/, enrollmentsSearchEntity);
		widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];

		expect(widget).to.exist;
	});

	describe('Enrollments requests and responses', function() {
		it('should send a search request for enrollments with the correct query params', function() {
			SetupFetchStub(/\/enrollments\/users\/169\?search=/, enrollmentsSearchEntity);
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];

			expect(fetchStub).to.have.been.calledWith(sinon.match('autoPinCourses=true'));
			expect(fetchStub).to.have.been.calledWith(sinon.match('pageSize=20'));
			expect(fetchStub).to.have.been.calledWith(sinon.match('embedDepth=1'));
			expect(fetchStub).to.have.been.calledWith(sinon.match('sort=-PinDate,OrgUnitName,OrgUnitId'));
		});

		it('should append enrollments on successive search requests', function() {
			fetchStub.returns(Promise.resolve());
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/2/, enrollmentsNextPageSearchResponse);
			fetchStub.withArgs(sinon.match('/enrollments/users/169?search='))
				.onFirstCall().returns(Promise.resolve(
					{entity: enrollmentsSearchEntity}
				))
				.onSecondCall().returns(Promise.resolve(
					{entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsNextPageSearchResponse)}
				));
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];

			widget._populateEnrollments({entity: enrollmentsSearchEntity});
			expect(widget._pinnedEnrollments.length).to.equal(2);
		});

		it('should fetch all pinned enrollments', function() {
			enrollmentsSearchResponse.links.push({
				rel: ['next'],
				href: '/more-pinned-enrollments'
			});
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/1/, enrollmentsSearchResponse);
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/2/, enrollmentsSearchResponse);

			fetchStub.withArgs(sinon.match('/enrollments/users/169?search='))
				.returns(Promise.resolve(
					{entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsSearchResponse)}
				))
				.withArgs(sinon.match('/more-pinned-enrollments'))
				.returns(Promise.resolve(
					{entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsNextPageSearchResponse)}
				));

			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];

			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsSearchResponse)});
			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsNextPageSearchResponse)});

			expect(fetchStub).to.have.been.calledWith(sinon.match('/more-pinned-enrollments'));
		});

		it('should rescale the course tile grid on search response', function() {
			SetupFetchStub(/\/enrollment$/, noEnrollmentsResponse);
			fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve(
				{entity: window.D2L.Hypermedia.Siren.Parse(noEnrollmentsResponse)}
			));
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
			var gridRescaleSpy = sandbox.spy(widget.$$('d2l-course-tile-grid'), '_rescaleCourseTileRegions');

			expect(gridRescaleSpy.called);
		});

		it('should display appropriate alert when there are no enrollments', function() {
			SetupFetchStub(/\/enrollment$/, noEnrollmentsResponse);
			fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve(
				{entity: window.D2L.Hypermedia.Siren.Parse(noEnrollmentsResponse)}
			));
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];

			expect(widget._hasEnrollments).to.equal(false);
			expect(widget._alertsView).to.include({ alertName: 'noCourses', alertType: 'call-to-action', alertMessage: 'You don\'t have any courses to display.' });
		});

		it('should display appropriate message when there are no pinned enrollments', function() {
			SetupFetchStub(/\/enrollments\/users\/169.*&.*$/, noPinnedEnrollmentsResponse);
			fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve(
				{entity: window.D2L.Hypermedia.Siren.Parse(noPinnedEnrollmentsResponse)}
			));
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(noPinnedEnrollmentsResponse)});

			expect(widget._hasEnrollments).to.equal(true);
			expect(widget._alertsView).to.include({ alertName: 'noPinnedCourses', alertType: 'call-to-action', alertMessage: 'You don\'t have any pinned courses. View All Courses to browse all available courses.' });
		});

		it('should update enrollment alerts when enrollment information is updated', function() {
			SetupFetchStub(/\/enrollments\/users\/169.*&.*$/, noPinnedEnrollmentsResponse);
			fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve(
				{entity: window.D2L.Hypermedia.Siren.Parse(noPinnedEnrollmentsResponse)}
			));
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(noPinnedEnrollmentsResponse)});

			expect(widget._hasEnrollments).to.equal(true);
			expect(widget._alertsView).to.include({ alertName: 'noPinnedCourses', alertType: 'call-to-action', alertMessage: 'You don\'t have any pinned courses. View All Courses to browse all available courses.' });
			var enrollmentsLengthChangedSpy = sandbox.spy(widget, '_enrollmentsChanged');
			widget._hasPinnedEnrollments = true;
			expect(enrollmentsLengthChangedSpy.called);
		});

		it('should remove all existing alerts when enrollment alerts are updated', function() {
			widget._addAlert('error', 'testError', 'this is a test');
			widget._addAlert('warning', 'testWarning', 'this is another test');
			expect(widget._alertsView).to.include({ alertName: 'testError', alertType: 'error', alertMessage: 'this is a test'});
			widget._enrollmentsChanged(true, true);
			expect(widget._alertsView).to.not.include({ alertName: 'testError', alertType: 'error', alertMessage: 'this is a test'});
		});
	});

	describe('With enrollments', function() {
		beforeEach(function() {
			// Prevents the _searchPath of the image selector from being null (causes failures in Firefox)
			widget.imageCatalogLocation = '/foo/bar';
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/1/, enrollmentsSearchResponse);
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/2/, enrollmentsSearchResponse);
		});

		it('should return the correct value from getCourseTileItemCount', function() {
			fetchStub.returns(Promise.resolve());
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
			widget._populateEnrollments({entity: enrollmentsSearchEntity});
			expect(widget.getCourseTileItemCount()).to.equal(2);
		});

		it('should correctly evaluate whether it has pinned/unpinned enrollments', function() {
			fetchStub.returns(Promise.resolve());
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
			widget._populateEnrollments({entity: enrollmentsSearchEntity});
			expect(widget._hasEnrollments).to.be.true;
			expect(widget._hasPinnedEnrollments).to.be.true;
		});

		it('should add a setCourseImageFailure warning alert when a request to set the image fails', function() {
			clock = sinon.useFakeTimers();
			var setCourseImageEvent = { detail: { status: 'failure'} };
			widget._onSetCourseImage(setCourseImageEvent);
			clock.tick(1001);
			expect(widget._alertsView).to.include({ alertName: 'setCourseImageFailure', alertType: 'warning', alertMessage: 'Sorry, we\'re unable to change your image right now. Please try again later.' });
		});

		it('should not add a setCourseImageFailure warning alert when a request to set the image succeeds', function() {
			var setCourseImageEvent = { detail: { status: 'success'} };
			widget._onSetCourseImage(setCourseImageEvent);
			expect(widget._alertsView).not.to.include({ alertName: 'setCourseImageFailure', alertType: 'warning', alertMessage: 'Sorry, we\'re unable to change your image right now. Please try again later.' });
		});

		it('should remove a setCourseImageFailure warning alert when a request to set the image is made', function() {
			clock = sinon.useFakeTimers();
			var setCourseImageEvent = { detail: { status: 'failure'} };
			widget._onSetCourseImage(setCourseImageEvent);
			clock.tick(1001);
			expect(widget._alertsView).to.include({ alertName: 'setCourseImageFailure', alertType: 'warning', alertMessage: 'Sorry, we\'re unable to change your image right now. Please try again later.' });
			setCourseImageEvent = { detail: { status: 'set'} };
			widget._onSetCourseImage(setCourseImageEvent);
			expect(widget._alertsView).not.to.include({ alertName: 'setCourseImageFailure', alertType: 'warning', alertMessage: 'Sorry, we\'re unable to change your image right now. Please try again later.' });
		});

		describe('course image upload', function() {
			var openChangeImageViewEvent = new CustomEvent(
				'open-change-image-view', {
					detail: {
						organization: organization
					},
					bubbles: true,
					composed: true
				}
			);

			it.skip('should focus on view all courses link when focus called initially', function() {
				fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve(
					{entity: enrollmentsSearchEntity}
				));
				widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
				return widget._fetchRoot().then(function() {
					widget.focus();
					if (widget.shadowRoot) {
						expect(widget.$$('#viewAllCourses')).to.equal(widget.shadowRoot.activeElement);
					} else {
						expect(widget.$$('#viewAllCourses').$$('a')).to.equal(document.activeElement);
					}
				});
			});

			it('should focus on course grid when focus called after course interacted with', function(done) {
				var tileGridFocusSpy = sandbox.spy(widget.$$('d2l-course-tile-grid'), 'focus');
				widget.dispatchEvent(openChangeImageViewEvent);

				widget.focus();

				setTimeout(function() {
					expect(tileGridFocusSpy.called);
					done();
				});
			});

			it('should return undefined for org unit id initally', function() {
				expect(widget.getLastOrgUnitId()).to.equal(undefined);
			});

			it('should return correct org unit id if course tile used', function(done) {

				widget.addEventListener('open-change-image-view', function() {
					expect(widget.getLastOrgUnitId()).to.equal('1');
					done();
				});

				widget.dispatchEvent(openChangeImageViewEvent);
			});

			it('should return correct org unit id from various href', function() {
				expect(widget._getOrgUnitIdFromHref('/organizations/671')).to.equal('671');
				expect(widget._getOrgUnitIdFromHref('/some/other/route/8798734534')).to.equal('8798734534');
			});
		});

		describe('d2l-course-pinned-change', function() {
			it('should bubble the correct d2l-course-pinned-change event when an enrollment is pinned', function(done) {
				widget.fire = sandbox.stub();

				var enrollmentPinEvent = new CustomEvent(
					'enrollment-pinned', {
						detail: {
							organization: organization,
							isPinned: true
						}
					}
				);

				widget.dispatchEvent(enrollmentPinEvent);

				setTimeout(function() {
					expect(widget.fire.calledWith('d2l-course-pinned-change',
						sinon.match({
							detail: {
								orgUnitId: 1,
								isPinned: true
							}
						})
					));
					done();
				});
			});

			it('should bubble the correct d2l-course-pinned-change event when an enrollment is unpinned', function(done) {
				widget.fire = sandbox.stub();

				var enrollmentUnpinEvent = new CustomEvent(
					'enrollment-unpinned', {
						detail: {
							organization: organization,
							isPinned: true
						}
					}
				);

				widget.dispatchEvent(enrollmentUnpinEvent);

				setTimeout(function() {
					expect(widget.fire.calledWith('d2l-course-pinned-change',
						sinon.match({
							detail: {
								orgUnitId: 1,
								isPinned: false
							}
						})
					));
					done();
				});
			});

			it('should remove the correct pinned enrollment receiving an external unpin event', function(done) {
				widget._addToPinnedEnrollments = sandbox.stub();
				widget._removeFromPinnedEnrollments = sandbox.stub();
				var coursePinnedChangeEvent = new CustomEvent(
					'd2l-course-pinned-change', {
						detail: {
							orgUnitId: 1,
							isPinned: false
						}
					});

				widget._orgUnitIdMap['1'] = 'enrollment1';

				document.body.dispatchEvent(coursePinnedChangeEvent);

				setTimeout(function() {
					expect(widget._removeFromPinnedEnrollments).to.have.been.calledWith('enrollment1');
					expect(widget._addToPinnedEnrollments).to.not.have.been.called;
					done();
				});
			});

			it('should add the correct enrollment to the pinned list when receiving an external unpin event', function(done) {
				widget._addToPinnedEnrollments = sandbox.stub();
				widget._removeFromPinnedEnrollments = sandbox.stub();
				var coursePinnedChangeEvent = new CustomEvent(
					'd2l-course-pinned-change', {
						detail: {
							orgUnitId: 2,
							isPinned: true
						}
					});

				widget._orgUnitIdMap['2'] = 'enrollment2';

				document.body.dispatchEvent(coursePinnedChangeEvent);

				setTimeout(function() {
					expect(widget._removeFromPinnedEnrollments).to.not.have.been.called;
					expect(widget._addToPinnedEnrollments).to.have.been.calledWith('enrollment2');
					done();
				});
			});

			it('should refetch enrollments if the pinned enrollment has no previously been fetched', function(done) {
				widget._addToPinnedEnrollments = sandbox.stub();
				widget._removeFromPinnedEnrollments = sandbox.stub();
				fetchStub = sandbox.stub();
				fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve());
				widget._refetchEnrollments = sandbox.stub();
				var coursePinnedChangeEvent = new CustomEvent(
					'd2l-course-pinned-change', {
						detail: {
							orgUnitId: 2,
							isPinned: true
						}
					});

				widget._orgUnitIdMap = {};

				document.body.dispatchEvent(coursePinnedChangeEvent);

				setTimeout(function() {
					expect(widget._removeFromPinnedEnrollments).to.not.have.been.called;
					expect(widget._addToPinnedEnrollments).to.not.have.been.called;
					expect(widget._refetchEnrollments).to.have.been.called;
					done();
				});
			});
		});
	});

	describe('User interaction', function() {
		beforeEach(function() {
			SetupFetchStub(/\/enrollment$/, noEnrollmentsResponse);
			fetchStub.withArgs(sinon.match('/enrollments/users/169?search=')).returns(Promise.resolve(
				window.D2L.Hypermedia.Siren.Parse(noEnrollmentsResponse)
			));
			widget.enrollmentsSearchAction = enrollmentsSearchEntity.actions[0];
		});

		it('should rescale the all courses view when it is opened', function(done) {
			clock = sinon.useFakeTimers();
			widget._enrollmentsSearchUrl = '';

			widget.$$('#viewAllCourses').click();
			flush(() => {
				var allCoursesRescaleSpy = sandbox.spy(widget.$$('d2l-all-courses').$$('d2l-all-courses-segregated-content'), '_rescaleCourseTileRegions');
				clock.tick(100);
				expect(allCoursesRescaleSpy.called);
				widget.$$('d2l-all-courses').$$('d2l-all-courses-segregated-content')._rescaleCourseTileRegions.restore();
				done();
			});
		});

		it('should remove a setCourseImageFailure alert when the all-courses overlay is closed', function() {
			clock = sinon.useFakeTimers();
			widget._enrollmentsSearchUrl = '';

			widget._addAlert('warning', 'setCourseImageFailure', 'failed to do that thing it should do');
			widget._openAllCoursesView(new Event('foo'));
			clock.tick(1001);
			expect(widget._alertsView).to.include({ alertName: 'setCourseImageFailure', alertType: 'warning', alertMessage: 'failed to do that thing it should do' });

			widget.fire('d2l-simple-overlay-closed');
			expect(widget._alertsView).to.not.include({ alertName: 'setCourseImageFailure', alertType: 'warning', alertMessage: 'failed to do that thing it should do' });
		});
	});

	describe('Pinning and unpinning enrollments', () => {

		it('should populate the _pinnedEnrollmentsMap when populating enrollments', () => {
			fetchStub.returns(Promise.resolve());
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/1/, enrollmentsSearchResponse);
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/2/, enrollmentsSearchResponse);
			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsSearchResponse)});
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/1')).to.be.true;
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/2')).to.be.true;
		});

		it('should remove unpinned enrollments from the _pinnedEnrollmentsMap when populating enrollments', () => {
			fetchStub.returns(Promise.resolve());
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/1/, enrollmentsSearchResponse);
			SetupFetchStub(/\/enrollments\/users\/169\/organizations\/2/, enrollmentsSearchResponse);
			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsSearchResponse)});
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/1')).to.be.true;
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/2')).to.be.true;

			SetupFetchStub(/\/enrollments\/users\/169.*&.*$/, enrollmentsSearchResponseOneUnpinned);
			widget._populateEnrollments({entity: window.D2L.Hypermedia.Siren.Parse(enrollmentsSearchResponseOneUnpinned)});
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/1')).to.be.false;
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/2')).to.be.true;
		});

		it('should add a pinned enrollment to the list if it doesnt exist in the map', () => {
			var parsedEnrollment = window.D2L.Hypermedia.Siren.Parse(enrollment1Pinned);
			widget._pinnedEnrollmentsMap = {};
			widget._addToPinnedEnrollments(parsedEnrollment);

			expect(widget._pinnedEnrollments).to.include(parsedEnrollment);
		});

		it('should add a pinned enrollment to the _pinnedEnrollmentsMap if it doesnt exist in the map', () => {
			var parsedEnrollment = window.D2L.Hypermedia.Siren.Parse(enrollment1Pinned);
			widget._pinnedEnrollmentsMap = {};
			widget._addToPinnedEnrollments(parsedEnrollment);

			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/1')).to.be.true;
		});

		it('should not add a pinned enrollment to the list if it exist in the map', () => {
			var parsedEnrollment = window.D2L.Hypermedia.Siren.Parse(enrollment1Pinned);
			widget._pinnedEnrollmentsMap = { '/enrollments/users/169/organizations/1': true };
			widget._addToPinnedEnrollments(parsedEnrollment);

			expect(widget._pinnedEnrollments).to.not.include(parsedEnrollment);
		});

		it('should remove the enrollment from the _pinnedEnrollmentsMap when _removeFromPinnedEnrollment', () => {
			var parsedEnrollment = window.D2L.Hypermedia.Siren.Parse(enrollment1Pinned);
			widget._pinnedEnrollments = [parsedEnrollment];
			widget._pinnedEnrollmentsMap = { '/enrollments/users/169/organizations/1': true };
			widget._removeFromPinnedEnrollments(parsedEnrollment);
			expect(widget._pinnedEnrollmentsMap.hasOwnProperty('/enrollments/users/169/organizations/1')).to.be.false;
		});
	});
});
