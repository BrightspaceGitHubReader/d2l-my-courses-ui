import { MyCoursesLocalizeBehavior } from '../../src/localize-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class ConsumerElement extends MyCoursesLocalizeBehavior(PolymerElement) {
	static get is() { return 'consumer-element'; }
}

window.customElements.define(ConsumerElement.is, ConsumerElement);

