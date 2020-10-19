import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

describe('d2l-my-courses-card-grid', function() {
	let widget;

	beforeEach(function(done) {
		widget = fixture('d2l-my-courses-card-grid-fixture');

		setTimeout(function() {
			done();
		});
	});

	describe('Loading', function() {
		it('should display loading spinner if loading is true', done => {
			let loadingSpinner = widget.shadowRoot.querySelector('d2l-loading-spinner');
			let cardGrid = widget.shadowRoot.querySelector('.course-card-grid');
			expect(widget.loading).to.be.false;
			expect(loadingSpinner).to.be.null;
			expect(cardGrid).to.not.be.null;

			widget.loading = true;
			requestAnimationFrame(() => {
				loadingSpinner = widget.shadowRoot.querySelector('d2l-loading-spinner');
				cardGrid = widget.shadowRoot.querySelector('.course-card-grid');
				expect(widget.loading).to.be.true;
				expect(loadingSpinner).to.not.be.null;
				expect(cardGrid).to.be.null;
				done();
			});
		});
	});

	describe('Card Grid', function() {

		it('should set --course-image-card-height as part of initial setup', done => {
			afterNextRender(this, () => {
				const height = getComputedStyle(widget).getPropertyValue('--course-image-card-height');

				expect(height).not.to.be.null;
				expect(height).not.to.be.undefined;
				expect(height.trim()).not.to.equal('0');
				expect(height.trim()).not.to.equal('0px');
				done();
			});
		});

		it('should set the columns-"n" class on the correct card grid on window resize', done => {
			const listener = () => {
				window.removeEventListener('resize', listener);

				setTimeout(() => {
					const courseCardGrid = widget.shadowRoot.querySelector('.course-card-grid');
					expect(courseCardGrid.classList.toString()).to.contain('columns-');
					done();
				}, 500);
			};

			window.addEventListener('resize', listener);

			window.dispatchEvent(new Event('resize'));
		});

		it('should set the columns-"n" class on the correct card grid when resize function called', done => {
			widget.onResize();

			requestAnimationFrame(() => {
				const courseCardGrid = widget.shadowRoot.querySelector('.course-card-grid');
				expect(courseCardGrid.classList.toString()).to.contain('columns-');
				done();
			});
		});
	});

	describe('Public Api', function() {
		let sandbox;

		beforeEach((done) => {
			sandbox = sinon.sandbox.create();
			widget.filteredEnrollments = ['org1', 'org2', 'org3'];
			setTimeout(done, 300);
		});

		afterEach(() => {
			sandbox.restore();
		});

		describe('refreshCardGridImages', function() {
			it('should call refreshImage on each course image card', () => {
				const courseCards = widget.shadowRoot.querySelectorAll('d2l-enrollment-card');

				const stub1 = sandbox.stub(courseCards[0], 'refreshImage');
				const stub2 = sandbox.stub(courseCards[1], 'refreshImage');
				const stub3 = sandbox.stub(courseCards[2], 'refreshImage');

				widget.refreshCardGridImages();

				expect(stub1).to.have.been.calledOnce;
				expect(stub2).to.have.been.calledOnce;
				expect(stub3).to.have.been.calledOnce;
			});
		});

		describe('spliceEnrollments', function() {
			it('should splice the filteredEnrollments array properly and request a re-render', () => {
				const spy = sandbox.spy(widget, 'requestUpdate');

				widget.spliceEnrollments(1, 1);

				expect(spy).to.have.been.calledOnce;
				expect(widget.filteredEnrollments).to.deep.equal(['org1', 'org3']);

				spy.reset();
				widget.spliceEnrollments(1, 0, 'org4');

				expect(spy).to.have.been.calledOnce;
				expect(widget.filteredEnrollments).to.deep.equal(['org1', 'org4', 'org3']);

				spy.reset();
				widget.spliceEnrollments(0, 2, 'org5');

				expect(spy).to.have.been.calledOnce;
				expect(widget.filteredEnrollments).to.deep.equal(['org5', 'org3']);
			});
		});
	});
});
