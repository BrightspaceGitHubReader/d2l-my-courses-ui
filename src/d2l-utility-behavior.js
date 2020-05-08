import '@polymer/polymer/polymer-legacy.js';
import 'd2l-fetch/d2l-fetch.js';
import SirenParse from 'siren-parser';
window.D2L = window.D2L || {};
window.D2L.MyCourses = window.D2L.MyCourses || {};

/*
* General utility functions that can be used in many places.
* @polymerBehavior D2L.MyCourses.UtilityBehavior
*/
D2L.MyCourses.UtilityBehavior = {
	// Creates a URL with a query from an Action and an object of required parameters
	createActionUrl: function(action, parameters) {
		parameters = parameters || {};
		action.fields = action.fields || [];
		const query = {};
		let val;

		action.fields.forEach((field) => {
			if (parameters.hasOwnProperty(field.name)) {
				val = parameters[field.name];
			} else {
				val = field.value;
			}

			if (val && typeof val === 'object' && val.constructor === Array) {
				let collapsedVal = '';
				for (let i = 0; i < val.length; i++) {
					if (i === 0) {
						collapsedVal += val[i];
					} else {
						collapsedVal += `${field.name}=${val[i]}`;
					}
					if (i < val.length - 1) { collapsedVal += '&'; }
				}
				query[field.name] = collapsedVal;
			} else {
				query[field.name] = val;
			}
		});

		const queryString = Object.keys(query).map((key) => {
			return `${key}=${query[key]}`;
		}).join('&');

		if (!queryString) {
			return action.href;
		}

		if (action.href.indexOf('?') > -1) {
			// href already has some query params, append ours
			return `${action.href}&${queryString}`;
		}

		return `${action.href}?${queryString}`;
	},
	// Creates a unique identifier for a Siren Entity (really just the self Link href)
	getEntityIdentifier: function(entity) {
		// An entity's self href should be unique, so use it as an identifier
		const selfLink = entity.getLinkByRel('self');
		return selfLink.href;
	},
	getOrgUnitIdFromHref(organizationHref) {
		const match = /[0-9]+$/.exec(organizationHref);

		if (!match) {
			return;
		}
		return match[0];
	},
	parseEntity: function(entity) {
		return SirenParse(entity);
	},
	fetchSirenEntity: function(url, clearCache) {
		if (!url) {
			return;
		}

		const headers = {
			Accept: 'application/vnd.siren+json'
		};

		if (clearCache) {
			headers['cache-control'] = 'no-cache';
		}

		return window.d2lfetch
			.fetch(new Request(url, {
				headers: headers
			}))
			.then(this.responseToSirenEntity.bind(this));
	},
	sirenEntityStoreFetch: function(url, token, clearCache) {
		if (!url) {
			return;
		}
		return window.D2L.Siren.EntityStore.fetch(url, token, clearCache);
	},
	performanceMark: function(name) {
		if (window.performance && window.performance.mark) {
			window.performance.mark(name);
		}
	},
	performanceMeasure: function(name, startMark, endMark, fireEvent) {
		if (window.performance && window.performance.measure) {
			window.performance.measure(name, startMark, endMark);
			const measure = window.performance.getEntriesByName(name, 'measure');
			if (measure.length === 1 && fireEvent) {
				document.dispatchEvent(new CustomEvent('d2l-performance-measure', {
					bubbles: true,
					detail: {
						name: name,
						value: measure[0]
					}
				}));
			}
		}
	},
	submitForm: function(url, formParameters) {
		const formData = new FormData();
		for (const formKey in formParameters) {
			if (formParameters.hasOwnProperty(formKey)) {
				formData.append(formKey, formParameters[formKey]);
			}
		}

		return window.d2lfetch
			.fetch(new Request(url, {
				method: 'PUT',
				body: formData
			}));
	},
	responseToSirenEntity: function(response) {
		if (response.ok) {
			return response
				.json()
				.then((json) => {
					return SirenParse(json);
				});
		}
		return Promise.reject(`${response.status} ${response.statusText}`);
	}
};
