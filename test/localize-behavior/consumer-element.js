import '../../src/localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class ConsumerElement extends mixinBehaviors([
	D2L.PolymerBehaviors.MyCourses.LocalizeBehavior
], PolymerElement) {
	static get is() { return 'consumer-element'; }
}

window.customElements.define(ConsumerElement.is, ConsumerElement);

