describe('d2l-filter-list-item-role', function() {
	var listItem;

	beforeEach(function() {
		listItem = fixture('d2l-filter-list-item-role-fixture');
	});

	it('should show the unchecked icon when the item is not selected', function() {
		listItem.selected = false;
		expect(window.getComputedStyle(listItem.$$('d2l-icon.icon-checked'), null).getPropertyValue('display')).to.equal('none');
		expect(window.getComputedStyle(listItem.$$('d2l-icon.icon-unchecked'), null).getPropertyValue('display')).to.not.equal('none');
	});

	it('should show the checked icon when the item is selected', function() {
		listItem.selected = true;
		expect(window.getComputedStyle(listItem.$$('d2l-icon.icon-checked'), null).getPropertyValue('display')).to.not.equal('none');
		expect(window.getComputedStyle(listItem.$$('d2l-icon.icon-unchecked'), null).getPropertyValue('display')).to.equal('none');
	});
});
