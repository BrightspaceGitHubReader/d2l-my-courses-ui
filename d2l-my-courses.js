/*
`d2l-my-courses`
Polymer-based web component for the my-courses widget that appears on the LE homepage.

If the `US90527-my-courses-updates` LD flag is on, the `updated-sort-logic` attribute is added and the `d2l-my-courses-container` component is rendered.
If it is off and the attribute is not added, the `d2l-my-courses-legacy` component is rendered.

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-tabs/d2l-tabs.js';
import './src/d2l-my-courses-container.js';
import './legacy/d2l-my-courses-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-my-courses">
	<template strip-whitespace="">
		<template is="dom-if" if="[[!updatedSortLogic]]">
			<d2l-my-courses-legacy
				class="[[class]]"
				enrollments-url="[[enrollmentsUrl]]"
				advanced-search-url="[[advancedSearchUrl]]"
				id="[[id]]"
				standard-semester-name="[[standardSemesterName]]"
				standard-department-name="[[standardDepartmentName]]"
				show-course-code="[[showCourseCode]]"
				course-updates-config="[[courseUpdatesConfig]]"
				image-catalog-location="[[imageCatalogLocation]]"
				promoted-searches="[[promotedSearches]]"
				user-settings-url="[[userSettingsUrl]]"
				show-semester="[[showSemester]]"
				org-unit-type-ids="[[orgUnitTypeIds]]"
				updated-sort-logic="[[updatedSortLogic]]"
				token="[[token]]">
			</d2l-my-courses-legacy>
		</template>
		<template is="dom-if" if="[[updatedSortLogic]]">
			<d2l-my-courses-container
				class="[[class]]"
				enrollments-url="[[enrollmentsUrl]]"
				advanced-search-url="[[advancedSearchUrl]]"
				id="[[id]]"
				standard-semester-name="[[standardSemesterName]]"
				standard-department-name="[[standardDepartmentName]]"
				show-course-code="[[showCourseCode]]"
				course-updates-config="[[courseUpdatesConfig]]"
				image-catalog-location="[[imageCatalogLocation]]"
				promoted-searches="[[promotedSearches]]"
				user-settings-url="[[userSettingsUrl]]"
				show-semester="[[showSemester]]"
				org-unit-type-ids="[[orgUnitTypeIds]]"
				updated-sort-logic="[[updatedSortLogic]]"
				token="[[token]]">
			</d2l-my-courses-container>
		</template>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-my-courses',
	behaviors: [
		D2L.MyCourses.MyCoursesBehavior,
		D2L.MyCourses.MyCoursesBehaviorLegacy
	]
});
