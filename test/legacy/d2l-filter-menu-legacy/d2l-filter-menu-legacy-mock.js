'use strict';
(function() {

	function createEntity() {
		var baseEntity = {
			'actions': [{
				'name': 'search-my-semesters',
				'href': '/enrollments'
			}, {
				'name': 'search-my-departments',
				'href': '/enrollments'
			}, {
				'name': 'search-my-enrollments',
				'href': '/enrollments',
				'fields': [{
					'name': 'parentOrganizations',
					'value': ''
				}, {
					'name': 'roles',
					'value': ''
				}]
			}]
		};
		return baseEntity;
	}

	window.d2lfetch = window.d2lfetch || { fetch: function() {} };
	var stub = sinon.stub(window.d2lfetch, 'fetch');

	stub.withArgs(sinon.match.has('url', sinon.match(/enrollments$/)))
		.returns(Promise.resolve({
			ok: true,
			json: function() {
				return Promise.resolve(createEntity());
			}
		}));

})();
