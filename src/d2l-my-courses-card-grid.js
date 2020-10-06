/*
`d2l-my-courses-card-grid`
Lit web component for the grid of enrollment cards.
*/

import 'd2l-enrollments/components/d2l-enrollment-card/d2l-enrollment-card.js';
import { css, html, LitElement } from 'lit-element';
import { entityFactory } from 'siren-sdk/src/es6/EntityFactory.js';
import { PresentationEntity } from 'siren-sdk/src/presentation/PresentationEntity.js';
import { styleMap } from 'lit-html/directives/style-map';

class MyCoursesCardGrid extends LitElement {

	static get properties() {
		return {
			// Array of courses to show
			filteredEnrollments: { type: Array },
			// If true, will hide courses that are "closed" (only needed if a closed course was just unpinned,
			// since we remove closed courses from the filteredEnrollments array on load)
			hidePastCourses: { attribute: 'hide-past-courses', reflect: true, type: Boolean },
			// URL to fetch widget settings
			presentationUrl: { type: String },
			// Token JWT Token for brightspace | a function that returns a JWT token for brightspace
			token: { type: Object },
			// Limit the number of cards shown to 12 (unless more than 12 are pinned)
			widgetView: { attribute: 'widget-view', reflect: true, type: Boolean },
			_hideCourseStartDate: { attribute: false, type: Boolean },
			_hideCourseEndDate: { attribute: false, type: Boolean },
			_numColumns: { attribute: false, type: Number },
			_showOrganizationCode: { attribute: false, type: Boolean },
			_showSemesterName: { attribute: false, type: Boolean },
			_showDropboxUnreadFeedback: { attribute: false, type: Boolean },
			_showUnattemptedQuizzes: { attribute: false, type: Boolean },
			_showUngradedQuizAttempts: { attribute: false, type: Boolean },
			_showUnreadDiscussionMessages: { attribute: false, type: Boolean },
			_showUnreadDropboxSubmissions: { attribute: false, type: Boolean }
		};
	}

	static get styles() {
		return [css`
			:host {
				display: block;

				/* Recalculated in onResize, so initial value is meaningless */
				--course-image-card-height: 0;
			}
			.course-card-grid {
				display: -ms-grid;
				display: grid;
				grid-column-gap: 15px;
			}
			.course-card-grid.columns-1 {
				grid-template-columns: 100%;
				-ms-grid-columns: 100%;
			}
			.course-card-grid.columns-2 {
				grid-template-columns: repeat(2, 1fr);
				-ms-grid-columns: 1fr 15px 1fr;
			}
			.course-card-grid.columns-3 {
				grid-template-columns: repeat(3, 1fr);
				-ms-grid-columns: 1fr 15px 1fr 15px 1fr;
			}
			.course-card-grid.columns-4 {
				grid-template-columns: repeat(4, 1fr);
				-ms-grid-columns: 1fr 15px 1fr 15px 1fr 15px 1fr;
			}

			.course-card-grid div,
			.course-card-grid d2l-enrollment-card {
				min-width: 0;
			}

			.course-card-grid d2l-enrollment-card {
				box-sizing: border-box;
				height: 100%;
				padding-bottom: 0.75rem;
				--course-image-height: var(--course-image-card-height);
			}

			:host([widget-view]) .course-card-grid d2l-enrollment-card:nth-of-type(n+13):not([pinned]),
			:host([hide-past-courses]) .course-card-grid d2l-enrollment-card[closed]:not([pinned]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.onResize = this.onResize.bind(this);

		this.filteredEnrollments = [];
		this.hidePastCourses = false;
		this.widgetView = false;
		this._hideCourseStartDate = false;
		this._hideCourseEndDate = false;
		this._numColumns = 0;
		this._showOrganizationCode = false;
		this._showSemesterName = false;
		this._showDropboxUnreadFeedback = false;
		this._showUnattemptedQuizzes = false;
		this._showUngradedQuizAttempts = false;
		this._showUnreadDiscussionMessages = false;
		this._showUnreadDropboxSubmissions = false;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('presentationUrl')) {
			this._onPresentationEntityChange();
		}
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this.onResize);
		requestAnimationFrame(() => {
			// Sets initial number of columns
			this.onResize();
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this.onResize);
	}

	render() {
		let msGridStyle = () => { return {};};
		const cssGridStyle = document.body.style['grid-template-columns'];
		// Can be empty string, hence the strict comparison
		if (cssGridStyle === undefined) {
			// Need for Legacy Edge 15 and below
			msGridStyle = (index) => {
				return {
					// The (* 2 - 1) accounts for the grid-gap-esque columns
					'-ms-grid-column': (index % this._numColumns + 1) * 2 - 1,
					'-ms-grid-row': Math.floor(index / this._numColumns) + 1
				};
			};
		}

		return html`
			<slot></slot>
			<div class="course-card-grid columns-${this._numColumns}">
				${this.filteredEnrollments.map((item, index) => html`
					<d2l-enrollment-card
						style=${styleMap(msGridStyle(index))}
						href="${item}"
						.token="${this.token}"
						?hide-course-start-date="${this._hideCourseStartDate}"
						?hide-course-end-date="${this._hideCourseEndDate}"
						?show-organization-code="${this._showOrganizationCode}"
						?show-semester-name="${this._showSemesterName}"
						?show-dropbox-unread-feedback="${this._showDropboxUnreadFeedback}"
						?show-unattempted-quizzes="${this._showUnattemptedQuizzes}"
						?show-ungraded-quiz-attempts="${this._showUngradedQuizAttempts}"
						?show-unread-discussion-messages="${this._showUnreadDiscussionMessages}"
						?show-unread-dropbox-submissions="${this._showUnreadDropboxSubmissions}">
					</d2l-enrollment-card>
				`)}
			</div>
		`;
	}

	onResize() {
		const courseCardGrid = this.shadowRoot.querySelector('.course-card-grid');
		if (!courseCardGrid) {
			return;
		}

		let containerWidth = this.offsetWidth;

		for (let parent = this.parentNode; containerWidth <= 0 && parent; parent = parent.parentNode) {
			containerWidth = parent.offsetWidth;
		}

		if (isNaN(containerWidth)) {
			return;
		}

		this._numColumns = Math.min(Math.floor(containerWidth / 350), 4) + 1;

		// For old version of Legacy Edge
		if (window.ShadyCSS) window.ShadyCSS.styleSubtree(this, { '--course-image-card-height': `${containerWidth / this._numColumns * 0.43}px` });
		else this.style.setProperty('--course-image-card-height', `${containerWidth / this._numColumns * 0.43}px`);
	}

	refreshCardGridImages(organization) {
		const courseCards = this.shadowRoot.querySelectorAll('d2l-enrollment-card');
		for (let i = 0; i < courseCards.length; i++) {
			courseCards[i].refreshImage(organization);
		}
	}

	spliceEnrollments(index, deleteCount, itemToAdd) {
		if (itemToAdd) {
			this.filteredEnrollments.splice(index, deleteCount, itemToAdd);
		} else {
			this.filteredEnrollments.splice(index, deleteCount);
		}
		this.requestUpdate();
	}

	_onPresentationEntityChange() {
		entityFactory(PresentationEntity, this.presentationUrl, this.token, entity => {
			this._hideCourseStartDate = entity.hideCourseStartDate();
			this._hideCourseEndDate = entity.hideCourseEndDate();
			this._showOrganizationCode = entity.showOrganizationCode();
			this._showSemesterName = entity.showSemesterName();
			this._showDropboxUnreadFeedback = entity.showDropboxUnreadFeedback();
			this._showUnattemptedQuizzes = entity.showUnattemptedQuizzes();
			this._showUngradedQuizAttempts = entity.showUngradedQuizAttempts();
			this._showUnreadDiscussionMessages = entity.showUnreadDiscussionMessages();
			this._showUnreadDropboxSubmissions = entity.showUnreadDropboxSubmissions();
		});
	}

}

window.customElements.define('d2l-my-courses-card-grid', MyCoursesCardGrid);
