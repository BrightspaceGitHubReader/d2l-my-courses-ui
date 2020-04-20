/*
`d2l-all-courses-content`
Polymer-based web component for the all courses content.
*/

import 'd2l-enrollments/components/d2l-enrollment-card/d2l-enrollment-card.js';
import './d2l-card-grid-behavior.js';
import './d2l-card-grid-styles.js';
import '../localize-behavior.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class AllCoursesContent extends mixinBehaviors([
	D2L.PolymerBehaviors.MyCourses.LocalizeBehavior,
	D2L.MyCourses.CardGridBehavior
], PolymerElement) {

	static get is() { return 'd2l-all-courses-content'; }

	static get properties() {
		return {
			totalFilterCount: Number,
			filterCounts: Object,
			isSearched: Boolean,
			filteredEnrollments: Array,
			showOrganizationCode: {
				type: Boolean,
				value: false
			},
			showSemesterName: {
				type: Boolean,
				value: false
			},
			hideCourseStartDate: {
				type: Boolean,
				value: false
			},
			hideCourseEndDate: {
				type: Boolean,
				value: false
			},
			showDropboxUnreadFeedback: {
				type: Boolean,
				value: false
			},
			showUnattemptedQuizzes: {
				type: Boolean,
				value: false
			},
			showUngradedQuizAttempts: {
				type: Boolean,
				value: false
			},
			showUnreadDiscussionMessages: {
				type: Boolean,
				value: false
			},
			showUnreadDropboxSubmissions: {
				type: Boolean,
				value: false
			},

			_noCoursesInSearch: Boolean,
			_noCoursesInSelection: Boolean,
			_noCoursesInDepartment: Boolean,
			_noCoursesInSemester: Boolean,
			_noCoursesInRole: Boolean
		};
	}

	static get observers() {
		return [
			'_enrollmentsChanged(filteredEnrollments.length)'
		];
	}

	static get template() {
		return html`
		<style include="d2l-card-grid-styles">
			:host {
				display: block;
			}
			.bottom-pad {
				padding-bottom: 20px;
			}
		</style>
		<span class="bottom-pad" hidden$="[[!_noCoursesInSearch]]">
			[[localize('noCoursesInSearch')]]
		</span>
		<span class="bottom-pad" hidden$="[[!_noCoursesInSelection]]">
			[[localize('noCoursesInSelection')]]
		</span>
		<span class="bottom-pad" hidden$="[[!_noCoursesInDepartment]]">
			[[localize('noCoursesInDepartment')]]
		</span>
		<span class="bottom-pad" hidden$="[[!_noCoursesInSemester]]">
			[[localize('noCoursesInSemester')]]
		</span>
		<span class="bottom-pad" hidden$="[[!_noCoursesInRole]]">
			[[localize('noCoursesInRole')]]
		</span>

		<div class="course-card-grid">
			<template is="dom-repeat" items="[[filteredEnrollments]]">
				<d2l-enrollment-card
					href="[[item]]"
					token="[[token]]"
					show-organization-code="[[showOrganizationCode]]"
					show-semester-name="[[showSemesterName]]"
					show-dropbox-unread-feedback="[[showDropboxUnreadFeedback]]"
					show-unattempted-quizzes="[[showUnattemptedQuizzes]]"
					show-ungraded-quiz-attempts="[[showUngradedQuizAttempts]]"
					show-unread-discussion-messages="[[showUnreadDiscussionMessages]]"
					show-unread-dropbox-submissions="[[showUnreadDropboxSubmissions]]"
					hide-course-start-date="[[hideCourseStartDate]]"
					hide-course-end-date="[[hideCourseEndDate]]">
				</d2l-enrollment-card>
			</template>
		</div>`;
	}

	connectedCallback() {
		super.connectedCallback();
		afterNextRender(this, () => {
			this._onResize();
		});
	}

	_enrollmentsChanged(enrollmentLength) {
		this._noCoursesInSearch = false;
		this._noCoursesInSelection = false;
		this._noCoursesInDepartment = false;
		this._noCoursesInSemester = false;
		this._noCoursesInRole = false;
		if (enrollmentLength === 0) {
			if (this.isSearched) {
				this._noCoursesInSearch = true;
			} else if (this.totalFilterCount === 1) {
				if (this.filterCounts.departments === 1) {
					this._noCoursesInDepartment = true;
				} else if (this.filterCounts.semesters === 1) {
					this._noCoursesInSemester = true;
				} else if (this.filterCounts.roles === 1) {
					this._noCoursesInRole = true;
				}
			} else if (this.totalFilterCount > 1) {
				this._noCoursesInSelection = true;
			}
		}
	}
}

window.customElements.define(AllCoursesContent.is, AllCoursesContent);
