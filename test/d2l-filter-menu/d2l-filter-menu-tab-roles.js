describe('d2l-filter-menu-tab-roles', function() {

	let sandbox,
		fetchStub,
		component,
		myEnrollmentsEntity,
		roleFiltersEntity;

	function parse(entity) {
		return window.D2L.Hypermedia.Siren.Parse(entity);
	}

	function getFilter(name, onOrOff) {
		return {
			rel: ['filter'],
			class: [onOrOff || 'off'],
			title: name,
			actions: [{
				name: 'add-filter',
				href: 'http://example.com/add'
			}, {
				name: 'remove-filter',
				href: 'http://example.com/remove'
			}]
		};
	}

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		myEnrollmentsEntity = {
			actions: [{
				name: 'set-role-filters',
				href: 'http://example.com',
				fields: [{
					name: 'include',
					value: ''
				}]
			}]
		};
		roleFiltersEntity = parse({
			entities: [getFilter('foo')],
			actions: [{
				name: 'apply-role-filters',
				href: 'http://example.com',
				fields: [{
					name: 'roles',
					value: '1,2,3,4'
				}]
			}]
		});

		fetchStub = sandbox.stub(window.d2lfetch, 'fetch').returns(Promise.resolve());

		component = fixture('d2l-filter-menu-tab-roles-fixture');
		component.myEnrollmentsEntity = myEnrollmentsEntity;
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('DOM manipulation', function() {
		it('should show the empty state message initially', function() {
			expect(component.shadowRoot.querySelector('.no-items-text').getAttribute('hidden')).to.be.null;
		});

		it('should show the empty state message if there are no role filters', function(done) {
			fetchStub.returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [] }, null, 2)], {type : 'application/json'}))
			));
			component._myEnrollmentsEntityChanged(myEnrollmentsEntity);

			setTimeout(function() {
				expect(component._showContent).to.be.false;
				expect(component.shadowRoot.querySelector('.no-items-text').getAttribute('hidden')).to.be.null;
				expect(fetchStub).to.have.been.called;
				done();
			});
		});

		it('should show content once the role filters have been fetched', function(done) {
			fetchStub.returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [getFilter('filter')] }, null, 2)], {type : 'application/json'}))
			));
			component._myEnrollmentsEntityChanged(myEnrollmentsEntity);

			setTimeout(function() {
				expect(component._showContent).to.be.true;
				expect(component.shadowRoot.querySelector('.no-items-text').getAttribute('hidden')).to.not.be.null;
				done();
			}, 50);
		});
	});

	describe('when a d2l-menu-item-change event occurs', function() {
		[
			{ name: 'should add the filter when selected', url: 'http://example.com/add', selected: true },
			{ name: 'should remove the filter when de-selected', url: 'http://example.com/remove', selected: false }
		].forEach(function(testCase) {
			it(testCase.name, function(done) {
				component._roleFiltersEntity = roleFiltersEntity;
				fetchStub.returns(Promise.resolve(
					new Response(new Blob([JSON.stringify(roleFiltersEntity, null, 2)], {type : 'application/json'}))
				));
				const listener = function() {
					component.removeEventListener('role-filters-changed', listener);
					expect(fetchStub).to.have.been.calledTwice;
					expect(fetchStub.getCall(1).args[0].url).to.equal(testCase.url);
					done();
				};
				component.addEventListener('role-filters-changed', listener);

				component.fire('d2l-menu-item-change', {
					selected: testCase.selected,
					value: 'foo'
				});
			});
		});

		it('should fire a role-filters-changed event with the new URL', function(done) {
			component._roleFiltersEntity = roleFiltersEntity;
			fetchStub.returns(Promise.resolve(
				new Response(new Blob([JSON.stringify(roleFiltersEntity, null, 2)], {type : 'application/json'}))
			));
			const listener = function(e) {
				component.removeEventListener('role-filters-changed', listener);
				expect(e.detail.url).to.equal('http://example.com?roles=1,2,3,4');
				done();
			};
			component.addEventListener('role-filters-changed', listener);

			component.fire('d2l-menu-item-change', {
				selected: true,
				value: 'foo'
			});
		});

		it('should work with a filter title that corresponds to more than one filter', function(done) {
			const filterOn = getFilter('foo', 'on');
			const filterOff = getFilter('foo', 'off');
			component._roleFiltersEntity = parse({ entities: [filterOff, filterOff] });

			fetchStub.onSecondCall().returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [filterOn, filterOff] }, null, 2)], {type : 'application/json'}))
			));
			fetchStub.onThirdCall().returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [filterOn, filterOn] }, null, 2)], {type : 'application/json'}))
			));

			const listener = function() {
				component.removeEventListener('role-filters-changed', listener);
				// Once on load and once per filter with the name 'foo'
				expect(fetchStub.callCount).to.equal(3);
				done();
			};
			component.addEventListener('role-filters-changed', listener);

			component.fire('d2l-menu-item-change', {
				selected: true,
				value: 'foo'
			});
		});
	});

	describe('clear', function() {
		beforeEach(function() {
			fetchStub.returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({}, null, 2)], {type : 'application/json'}))
			));
		});
		it('should reset the "selected" state to false on all filter items', function(done) {
			component._filterTitles = [ 'one', 'two', 'three' ];
			const filters = component.shadowRoot.querySelector('d2l-menu').querySelectorAll('d2l-filter-list-item-role');
			for (let i = 0; i < filters.length; i++) {
				filters[i].selected = true;
			}

			component.clear().then(function() {
				for (let i = 0; i < filters.length; i++) {
					expect(filters[i].selected).to.be.false;
				}

				done();
			});
		});

		it('should re-fetch the role filters with their updated states (all "off")', function() {
			return component.clear().then(function() {
				sinon.assert.match(fetchStub.getCall(1).args[0].url, sinon.match(/\?include=$/));
			});
		});
	});

	describe('_parseFilterItems', function() {
		it('should have separate entries for filters with different title attributes', function() {
			component._parseFilterItems({ entities: [getFilter('foo'), getFilter('bar')] });

			expect(component._filterTitles.length).to.equal(2);
		});

		it('should combine entries for filters with the same title attribute', function() {
			component._parseFilterItems({ entities: [getFilter('foo'), getFilter('foo') ]});

			expect(component._filterTitles.length).to.equal(1);
		});
	});
});
