import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

describe('d2l-my-courses-card-grid', function() {
	let widget;

	beforeEach(function(done) {
		widget = fixture('d2l-my-courses-card-grid-fixture');

		setTimeout(function() {
			done();
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

		it('refreshCardGridImages should call refreshImage on each course image card', () => {
			const courseCards = widget.shadowRoot.querySelectorAll('d2l-enrollment-card');

			const stub1 = sandbox.stub(courseCards[0], 'refreshImage');
			const stub2 = sandbox.stub(courseCards[1], 'refreshImage');
			const stub3 = sandbox.stub(courseCards[2], 'refreshImage');

			widget.refreshCardGridImages();

			expect(stub1).to.have.been.calledOnce;
			expect(stub2).to.have.been.calledOnce;
			expect(stub3).to.have.been.calledOnce;
		});

		it('focusCardDropdown should call focusDropdownOpener until the correct card is focused and return true', () => {
			const courseCards = widget.shadowRoot.querySelectorAll('d2l-enrollment-card');

			const stub1 = sandbox.stub(courseCards[0], 'focusDropdownOpener');
			stub1.withArgs('org2').returns(false);
			const stub2 = sandbox.stub(courseCards[1], 'focusDropdownOpener');
			stub2.withArgs('org2').returns(true);
			const stub3 = sandbox.stub(courseCards[2], 'focusDropdownOpener');

			const response = widget.focusCardDropdown('org2');

			expect(response).to.be.true;
			expect(stub1).to.have.been.calledOnce;
			expect(stub2).to.have.been.calledOnce;
			expect(stub3).to.have.not.been.called;
		});

		it('focusCardDropdown should return false if the org does not match and cards', () => {
			const courseCards = widget.shadowRoot.querySelectorAll('d2l-enrollment-card');

			const stub1 = sandbox.stub(courseCards[0], 'focusDropdownOpener');
			stub1.withArgs('org4').returns(false);
			const stub2 = sandbox.stub(courseCards[1], 'focusDropdownOpener');
			stub2.withArgs('org4').returns(false);
			const stub3 = sandbox.stub(courseCards[2], 'focusDropdownOpener');
			stub3.withArgs('org4').returns(false);

			const response = widget.focusCardDropdown('org4');

			expect(response).to.be.false;
			expect(stub1).to.have.been.calledOnce;
			expect(stub2).to.have.been.calledOnce;
			expect(stub3).to.have.been.calledOnce;
		});
	});
});
