describe('d2l-filter-list-item', function() {
	let sandbox,
		listItem,
		enrollment,
		organization,
		fetchStub;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		enrollment = {
			rel: ['enrollment'],
			links: [{
				rel: ['self'],
				href: '/enrollments'
			}, {
				rel: ['https://api.brightspace.com/rels/organization'],
				href: '/organizations/1'
			}]
		};
		organization = {
			properties: {
				name: 'foo'
			},
			links: [{
				rel: ['self'],
				href: 'bar'
			}]
		};

		listItem = fixture('d2l-filter-list-item-fixture');
		fetchStub = sandbox.stub(window.d2lfetch, 'fetch').returns(Promise.resolve(
			new Response(new Blob([JSON.stringify(organization, null, 2)], {type : 'application/json'}))
		));
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should show the unchecked icon when the item is not selected', function() {
		listItem.selected = false;
		expect(window.getComputedStyle(listItem.shadowRoot.querySelector('d2l-icon.icon-checked'), null).getPropertyValue('display')).to.equal('none');
		expect(window.getComputedStyle(listItem.shadowRoot.querySelector('d2l-icon.icon-unchecked'), null).getPropertyValue('display')).to.not.equal('none');
	});

	it('should show the checked icon when the item is selected', function() {
		listItem.selected = true;
		expect(window.getComputedStyle(listItem.shadowRoot.querySelector('d2l-icon.icon-checked'), null).getPropertyValue('display')).to.not.equal('none');
		expect(window.getComputedStyle(listItem.shadowRoot.querySelector('d2l-icon.icon-unchecked'), null).getPropertyValue('display')).to.equal('none');
	});

	it('should fetch the organization when the enrollment changes', function(done) {
		listItem.set('enrollmentEntity', window.D2L.Hypermedia.Siren.Parse(enrollment));

		setTimeout(function() {
			expect(fetchStub).to.have.been.calledOnce;
			expect(fetchStub.getCall(0).args[0].url).to.include('/organizations/1');
			expect(listItem._organizationUrl).to.equal('/organizations/1');
			done();
		});
	});

	it('should update text and value based off of organizations response', function(done) {
		listItem.set('enrollmentEntity', window.D2L.Hypermedia.Siren.Parse(enrollment));

		setTimeout(function() {
			expect(listItem.text).to.equal('foo');
			expect(listItem.value).to.equal('bar');
			done();
		}, 50);
	});
});
