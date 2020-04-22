/*
`d2l-my-courses-card-grid`
Polymer-based web component for the all courses content.
*/

import 'd2l-enrollments/components/d2l-enrollment-card/d2l-enrollment-card.js';
import './card-grid/d2l-card-grid-behavior.js';
import './card-grid/d2l-card-grid-styles.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class MyCoursesCardGrid extends mixinBehaviors([
	D2L.MyCourses.CardGridBehavior
], PolymerElement) {

	static get is() { return 'd2l-my-courses-card-grid'; }

	static get properties() {
		return {
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
			}
		};
	}

	static get template() {
		return html`
		<style include="d2l-card-grid-styles">
			:host {
				display: block;
			}
		</style>
		<slot></slot>
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

}

window.customElements.define(MyCoursesCardGrid.is, MyCoursesCardGrid);
