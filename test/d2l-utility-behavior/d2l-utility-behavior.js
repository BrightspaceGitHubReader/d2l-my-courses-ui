import { Actions } from 'd2l-hypermedia-constants';

describe('d2l-utility-behavior', function() {
	let component,
		enrollmentEntity;

	const enrollment = {
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
		}, {
			name: 'action-with-query-params',
			href: '/enrollments?param1=foo',
			fields: [{
				name: 'param2',
				value: 'bar'
			}]
		}, {
			name: 'search-my-enrollments',
			href: '/enrollments',
			fields: [{
				name: 'orgUnitTypeId'
			}]
		}],
		links: [{
			rel: ['https://api.brightspace.com/rels/organization'],
			href: '/organizations/1'
		}, {
			rel: ['self'],
			href: '/enrollments/users/169/organizations/1'
		}]
	};

	before(function() {
		enrollmentEntity = window.D2L.Hypermedia.Siren.Parse(enrollment);
	});

	beforeEach(function() {
		component = fixture('default-fixture');
	});

	describe('createActionUrl', function() {
		it('should return the URL with default values if no parameters are specified', function() {
			const url = component.createActionUrl(enrollmentEntity.getActionByName(Actions.enrollments.unpinCourse));

			expect(url).to.equal(`${enrollment.actions[0].href}?pinned=false`);
		});

		it('should return the URL with the specified query parameter(s)', function() {
			const url = component.createActionUrl(
				enrollmentEntity.getActionByName(Actions.enrollments.unpinCourse),
				{ pinned: 'foo' }
			);

			expect(url).to.equal(`${enrollment.actions[0].href}?pinned=foo`);
		});

		it('should not add any fields that are not on the action', function() {
			const url = component.createActionUrl(
				enrollmentEntity.getActionByName(Actions.enrollments.unpinCourse),
				{ foo: 'bar' }
			);

			expect(url).to.not.match(/foo=bar/);
		});

		it('should work with hrefs that already have query params', function() {
			const url = component.createActionUrl(
				enrollmentEntity.getActionByName('action-with-query-params'),
				{ param2: 'baz' }
			);

			expect(url).to.equal('/enrollments?param1=foo&param2=baz');
		});

		it('should generate orgUnitTypeId query string as expected for more than one orgUnitTypeId', function() {
			const url = component.createActionUrl(
				enrollmentEntity.getActionByName(Actions.enrollments.searchMyEnrollments),
				{ orgUnitTypeId: [3, 7] }
			);

			expect(url).to.equal('/enrollments?orgUnitTypeId=3&orgUnitTypeId=7');
		});

		it('should generate orgUnitTypeId query string as expected when only one orgUnitTypeId given as array', function() {
			const url = component.createActionUrl(
				enrollmentEntity.getActionByName(Actions.enrollments.searchMyEnrollments),
				{ orgUnitTypeId: [3] }
			);

			expect(url).to.equal('/enrollments?orgUnitTypeId=3');
		});

		it('should generate orgUnitTypeId query string as expected when only one orgUnitTypeId given as number', function() {
			const url = component.createActionUrl(
				enrollmentEntity.getActionByName(Actions.enrollments.searchMyEnrollments),
				{ orgUnitTypeId: 3 }
			);

			expect(url).to.equal('/enrollments?orgUnitTypeId=3');
		});
	});

	describe('getEntityIdentifier', function() {
		it('should get the unique enrollment ID based off the self link', function() {
			const id = component.getEntityIdentifier(enrollmentEntity);

			expect(id).to.equal(enrollment.links[1].href);
		});
	});
});
