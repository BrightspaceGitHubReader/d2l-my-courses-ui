/*
`d2l-my-courses-container`
Polymer-based web component for the my-courses widget that appears on the LE homepage.

Component for when the `d2l.Tools.MyCoursesWidget.UpdatedSortLogic` config variable is on, meaning the `updated-sort-logic` property is true.

*/

import '@polymer/polymer/polymer-legacy.js';

import 'd2l-tabs/d2l-tabs.js';
import './card-grid/d2l-my-courses-content.js';
import './d2l-my-courses-behavior.js';
import './d2l-utility-behavior.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-my-courses-container">
	<template strip-whitespace="">
		<template is="dom-if" if="[[_showGroupByTabs]]">
			<d2l-tabs>
				<template items="[[_tabSearchActions]]" is="dom-repeat">
					<!-- item.name is an OrgUnitId, and querySelector does not work with components with ids that start with a number -->
					<d2l-tab-panel id="panel-[[item.name]]" text="[[item.title]]" selected="[[item.selected]]">
						<d2l-my-courses-content
							href="[[presentationUrl]]"
							token="[[token]]"
							advanced-search-url="[[advancedSearchUrl]]"
							course-image-upload-cb="[[courseImageUploadCb]]"
							enrollments-search-action="[[item.enrollmentsSearchAction]]"
							image-catalog-location="[[imageCatalogLocation]]"
							standard-department-name="[[standardDepartmentName]]"
							standard-semester-name="[[standardSemesterName]]"
							org-unit-type-ids="[[orgUnitTypeIds]]"
							tab-search-actions="[[_tabSearchActions]]"
							tab-search-type="[[_tabSearchType]]"
							update-user-settings-action="[[_updateUserSettingsAction]]"
							changed-course-enrollment="[[_changedCourseEnrollment]]">
						</d2l-my-courses-content>
					</d2l-tab-panel>
				</template>
			</d2l-tabs>
		</template>
		<template is="dom-if" if="[[!_showGroupByTabs]]">
			<d2l-my-courses-content
				href="[[presentationUrl]]"
				token="[[token]]"
				advanced-search-url="[[advancedSearchUrl]]"
				org-unit-type-ids="[[orgUnitTypeIds]]"
				course-image-upload-cb="[[courseImageUploadCb]]"
				enrollments-search-action="[[_enrollmentsSearchAction]]"
				image-catalog-location="[[imageCatalogLocation]]"
				standard-department-name="[[standardDepartmentName]]"
				standard-semester-name="[[standardSemesterName]]">
			</d2l-my-courses-content>
		</template>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-my-courses-container',
	behaviors: [
		D2L.MyCourses.MyCoursesBehavior
	]
});
