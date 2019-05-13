/*
`d2l-my-courses-legacy`
Polymer-based web component for the my-courses widget that appears on the LE homepage.

Component for when the `US90527-my-courses-updates` LD flag is off.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-tabs/d2l-tabs.js';
import './tile-grid/d2l-my-courses-content-animated.js';
import './d2l-my-courses-behavior.js';
import './d2l-utility-behavior.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-my-courses-legacy">
	<template strip-whitespace="">
		<d2l-my-courses-content-animated
			href="[[presentationUrl]]"
			token="[[token]]"
			advanced-search-url="[[advancedSearchUrl]]"
			enrollments-search-action="[[_enrollmentsSearchAction]]"
			image-catalog-location="[[imageCatalogLocation]]"
			show-course-code="[[showCourseCode]]"
			org-unit-type-ids="[[orgUnitTypeIds]]"
			show-semester="[[showSemester]]"
			standard-department-name="[[standardDepartmentName]]"
			standard-semester-name="[[standardSemesterName]]"
			course-updates-config="[[courseUpdatesConfig]]"
			course-image-upload-cb="[[courseImageUploadCb]]">
		</d2l-my-courses-content-animated>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-my-courses-legacy',
	behaviors: [
		D2L.MyCourses.MyCoursesBehaviorLegacy
	]
});
