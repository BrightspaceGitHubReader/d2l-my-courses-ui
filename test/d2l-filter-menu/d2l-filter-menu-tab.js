describe('d2l-filter-menu-tab', function() {
	let sandbox,
		component,
		organization,
		fetchStub;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		component = fixture('d2l-filter-menu-tab-fixture');
		component.searchAction = {
			name: 'search',
			href: '/'
		};
		organization = {
			class: ['active', 'semester'],
			rel: ['https://api.brightspace.com/rels/organization'],
			href: '/organizations/1'
		};

		fetchStub = sandbox.stub(window.d2lfetch, 'fetch').returns(Promise.resolve());
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('DOM manipulation', function() {
		it('should show empty state message initially', function() {
			expect(component.shadowRoot.querySelector('.no-items-text').getAttribute('hidden')).to.be.null;
		});

		it('should show content once the tab has loaded', function() {
			fetchStub.onFirstCall().returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [organization] }, null, 2)], {type : 'application/json'}))
			));

			return component.load().then(function() {
				expect(component.shadowRoot.querySelector('.no-items-text').getAttribute('hidden')).to.not.be.null;
			});
		});

		it('should show the No Results message when there are no search results', function(done) {
			requestAnimationFrame(function() {
				component.fire('d2l-search-widget-results-changed', {
					searchResponse: {
						entities: []
					}
				});

				expect(component._allFilters.length).to.equal(0);
				expect(component._hasSearchResults).to.be.false;
				expect(component.shadowRoot.querySelector('div > div.no-items-text').getAttribute('hidden')).to.be.null;
				done();
			});
		});

		it('should not show the No Results message when there are search results', function(done) {
			requestAnimationFrame(function() {
				component.fire('d2l-search-widget-results-changed', {
					searchResponse: {
						entities: [organization]
					}
				});

				expect(component._allFilters.length).to.equal(1);
				expect(component._hasSearchResults).to.be.true;
				expect(component.shadowRoot.querySelector('div > div.no-items-text').getAttribute('hidden')).to.not.be.null;
				done();
			});

		});
	});

	describe('selectedFilters', function() {
		it('should generate an event when selectedFilters is changed', function(done) {
			const listener = function() {
				component.removeEventListener('selected-filters-changed', listener);
				done();
			};
			component.addEventListener('selected-filters-changed', listener);

			component.selectedFilters = [organization];
		});
	});

	describe('when a d2l-menu-item-change event occurs', function() {
		it('should add the filter if it was selected', function(done) {
			component._allFilters = [organization];
			component.selectedFilters = [];

			const listener = function() {
				component.removeEventListener('d2l-menu-item-change', listener);
				expect(component.selectedFilters.length).to.equal(1);

				done();
			};
			component.addEventListener('d2l-menu-item-change', listener);

			component.fire('d2l-menu-item-change', {
				selected: true,
				value: organization
			});
		});

		it('should remove the filter if it was deselected', function(done) {
			component._allFilters = [organization];
			component.selectedFilters = [organization];

			const listener = function() {
				component.removeEventListener('d2l-menu-item-change', listener);
				expect(component.selectedFilters.length).to.equal(0);

				done();
			};
			component.addEventListener('d2l-menu-item-change', listener);

			component.fire('d2l-menu-item-change', {
				selected: false,
				value: organization
			});
		});

		it('should fire a selected-filters-changed event', function(done) {
			const listener = function() {
				component.removeEventListener('selected-filters-changed', listener);
				done();
			};
			component.addEventListener('selected-filters-changed', listener);

			component.fire('d2l-menu-item-change', {
				selected: false,
				value: organization
			});
		});
	});

	describe('load', function() {
		it('should not re-fetch data if it has already loaded it, and instead just clear the search', function(done) {
			component.shadowRoot.querySelector('d2l-search-widget').clear = sandbox.stub();
			component._allFilters = [organization];

			requestAnimationFrame(() => {
				fetchStub.reset();
				component.load().then(function() {
					expect(component.shadowRoot.querySelector('d2l-search-widget').clear).to.have.been.called;
					expect(fetchStub).to.have.not.been.called;
					done();
				});
			});
		});

		it('should fetch data if it has not already been loaded', function() {
			fetchStub.onFirstCall().returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({}, null, 2)], {type : 'application/json'}))
			));

			return component.load().then(function() {
				expect(fetchStub).to.have.been.called;
			});
		});

		it('should set _showContent to false if 0 filters are returned', function() {
			fetchStub.onFirstCall().returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [] }, null, 2)], {type : 'application/json'}))
			));
			expect(component._showContent).to.be.false;

			return component.load().then(function() {
				expect(component._showContent).to.be.false;
			});
		});

		it('should set _showContent to true if >0 filters are returned', function() {
			fetchStub.onFirstCall().returns(Promise.resolve(
				new Response(new Blob([JSON.stringify({ entities: [organization] }, null, 2)], {type : 'application/json'}))
			));
			expect(component._showContent).to.be.false;

			return component.load().then(function() {
				expect(component._showContent).to.be.true;
			});
		});
	});

	describe('_checkSelected', function() {
		it('should return true if item should be selected', function() {
			component.selectedFilters = [organization.href];
			expect(component._checkSelected(organization)).to.be.true;
		});

		it('should return false if the item should not be selected', function() {
			component.selectedFilters = ['foo'];
			expect(component._checkSelected(organization)).to.be.false;
		});
	});
});
