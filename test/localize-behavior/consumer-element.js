import { MyCoursesLocalizeBehavior, MyCoursesLocalizeMixin } from '../../src/localize-behavior.js';
import { LitElement } from 'lit-element';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class ConsumerElement extends MyCoursesLocalizeBehavior(PolymerElement) {
	static get is() { return 'consumer-element'; }
}

window.customElements.define(ConsumerElement.is, ConsumerElement);

class ConsumerElementLit extends MyCoursesLocalizeMixin(LitElement) {
	static get is() { return 'consumer-element-lit'; }
}

window.customElements.define(ConsumerElementLit.is, ConsumerElementLit);

