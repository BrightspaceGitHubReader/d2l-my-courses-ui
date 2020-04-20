/*
`d2l-filter-menu-tab`
Polymer-based web component for the filter menu tabs.
*/

import '@brightspace-ui/core/components/menu/menu.js';
import 'd2l-search-widget/d2l-search-widget.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import './d2l-filter-list-item.js';
import '../d2l-utility-behavior.js';
import '../localize-behavior.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { Rels } from 'd2l-hypermedia-constants';

class FilterMenuTab extends mixinBehaviors([
	D2L.PolymerBehaviors.MyCourses.LocalizeBehavior,
	D2L.MyCourses.UtilityBehavior
], PolymerElement) {

	static get is() { return 'd2l-filter-menu-tab'; }

	static get properties() {
		return {
			selectedFilters: {
				type: Array,
				value: function() { return []; },
				notify: true
			},
			menuLabelText: String,
			noFiltersText: String,
			searchAction: Object,
			searchPlaceholderText: String,
			_hasSearchResults: {
				type: Boolean,
				value: false,
				computed: '_computeHasSearchResults(_allFilters.length)'
			},
			_allFilters: {
				type: Array,
				value: function() { return []; }
			},
			_showContent: {
				type: Boolean,
				value: false
			}
		};
	}

	static get template() {
		return html`
		<style>
			:host {
				display: flex;
				flex-direction: column;
			}
			d2l-search-widget {
				display: block;
				margin: 10px 20px;
			}
			.no-items-text {
				@apply --d2l-body-compact-text;
				margin: 10px;
			}
		</style>
		<div hidden$="[[!_showContent]]">
			<d2l-search-widget placeholder-text="[[searchPlaceholderText]]" search-action="[[searchAction]]" search-field-name="search">
			</d2l-search-widget>

			<d2l-menu label="[[menuLabelText]]">
				<template is="dom-repeat" items="[[_allFilters]]">
					<d2l-filter-list-item enrollment-entity="[[item]]" selected="[[_checkSelected(item)]]">
					</d2l-filter-list-item>
				</template>
			</d2l-menu>

			<div class="no-items-text" hidden$="[[_hasSearchResults]]">[[localize('noSearchResults')]]</div>
		</div>
		<div class="no-items-text" hidden$="[[_showContent]]">[[noFiltersText]]</div>`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-search-widget-results-changed', this._onSearchWidgetResultsChanged);
		this.addEventListener('d2l-menu-item-change', this._onMenuItemChange);
	}

	load() {
		if (!this.searchAction) {
			return;
		}

		if (this._allFilters.length > 0) {
			// We've already loaded, don't load again
			this.$$('d2l-search-widget').clear();
			return Promise.resolve();
		}

		return this.fetchSirenEntity(this.searchAction.href)
			.then((resultsEntity) => {
				this.set('_allFilters', resultsEntity.entities || []);
				this.$$('d2l-search-widget').search();
				this._showContent = this._allFilters.length > 0;
			});
	}
	clear() {
		const items = this.$$('d2l-menu').querySelectorAll('d2l-filter-list-item');
		for (let i = 0; i < items.length; i++) {
			items[i].selected = false;
		}

		this.$$('d2l-search-widget').clear();
		this.selectedFilters = [];
	}
	resize() {
		this.$$('d2l-menu').resize();

		setTimeout(() => {
			// DE24225 - force dropdown to resize after opening
			window.dispatchEvent(new Event('resize'));
		}, 200);
	}

	_checkSelected(entity) {
		// Checks if the given entity should be "selected" - used when search results change
		const id = entity.href || entity.getLinkByRel(Rels.organization).href;
		return this.selectedFilters.indexOf(id) > -1;
	}
	_computeHasSearchResults(allFiltersLength) {
		return allFiltersLength > 0;
	}
	_onMenuItemChange(e) {
		if (e.detail.selected) {
			this.push('selectedFilters', e.detail.value);
		} else {
			const index = this.selectedFilters.indexOf(e.detail.value);
			this.splice('selectedFilters', index, 1);
		}
		this.fire('selected-filters-changed');
	}
	_onSearchWidgetResultsChanged(e) {
		this.set('_allFilters', e.detail.searchResponse.entities || []);
		this.resize();
	}
}

window.customElements.define(FilterMenuTab.is, FilterMenuTab);
