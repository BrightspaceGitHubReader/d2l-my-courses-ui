describe('localize behavior', function() {
	let component;

	beforeEach(function() {
		document.documentElement.removeAttribute('lang');
	});

	it('should have default locale', function() {
		component = fixture('default-fixture');

		expect(component.locale).to.equal('en-us');
		expect(component.localize('allCourses')).to.equal('All Courses');
	});

	it('should use default locale if provided locale does not exist', function() {
		document.documentElement.setAttribute('lang', 'zz-ZZ');

		component = fixture('default-fixture');

		expect(component.locale).to.equal('zz-ZZ');
		expect(component.localize('allCourses')).to.equal('All Courses');
	});

	describe('localize mappings', function() {
		it('should have translation for every english term', function() {
			component = fixture('default-fixture');
			const terms = Object.keys(component.resources['en']);
			const locales = Object.keys(component.resources);
			for (let i = 0; i < locales.length; i++) {
				const currentLocale = locales[i];
				for (let j = 0; j < terms.length; j++) {
					expect(component.resources[currentLocale].hasOwnProperty(terms[j]), `missing term ${terms[j]} on locale ${currentLocale}`).to.be.true;
				}
			}
		});

		it('should have no empty mappings for supported langs', function() {
			const locales = Object.keys(component.resources);
			for (let i = 0; i < locales.length; i++) {
				const currentLocale = locales[i];
				const mappings = Object.values(component.resources[currentLocale]);
				for (let j = 0; j < mappings.length; j++) {
					expect(mappings[j].trim()).to.not.equal('');
				}

			}
		});
	});

});
