import 'd2l-localize-behavior/d2l-localize-behavior.js';
import './lang/ar.js';
import './lang/da-dk.js';
import './lang/de.js';
import './lang/en.js';
import './lang/es.js';
import './lang/fi.js';
import './lang/fr.js';
import './lang/fr-fr.js';
import './lang/ja.js';
import './lang/ko.js';
import './lang/nb.js';
import './lang/nl.js';
import './lang/pt.js';
import './lang/sv.js';
import './lang/tr.js';
import './lang/zh-tw.js';
import './lang/zh.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.MyCourses = window.D2L.PolymerBehaviors.MyCourses || {};
/*
* @polymerBehavior D2L.PolymerBehaviors.MyCourses.LocalizeBehavior
*/
D2L.PolymerBehaviors.MyCourses.LocalizeBehaviorImpl = {
	properties: {
		locale: {
			type: String,
			value: function() {
				return document.documentElement.lang
					|| document.documentElement.getAttribute('data-lang-default')
					|| 'en-us';
			}
		},
		resources: {
			value: function() {
				return {
					'en': this.en,
					'ar': this.ar,
					'da-dk': this['da-dk'],
					'de': this.de,
					'es': this.es,
					'fi': this.fi,
					'fr': this.fr,
					'fr-fr': this['fr-fr'],
					'ja': this.ja,
					'ko': this.ko,
					'nb': this.nb,
					'nl': this.nl,
					'pt': this.pt,
					'sv': this.sv,
					'tr': this.tr,
					'zh': this.zh,
					'zh-tw': this['zh-tw']
				};
			}
		}
	}
};

/*
* @polymerBehavior D2L.PolymerBehaviors.MyCourses.LocalizeBehavior
*/
D2L.PolymerBehaviors.MyCourses.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.MyCourses.LocalizeBehaviorImpl,
	D2L.PolymerBehaviors.MyCourses.LangArBehavior,
	D2L.PolymerBehaviors.MyCourses.LangDadkBehavior,
	D2L.PolymerBehaviors.MyCourses.LangDeBehavior,
	D2L.PolymerBehaviors.MyCourses.LangEnBehavior,
	D2L.PolymerBehaviors.MyCourses.LangEsBehavior,
	D2L.PolymerBehaviors.MyCourses.LangFiBehavior,
	D2L.PolymerBehaviors.MyCourses.LangFrBehavior,
	D2L.PolymerBehaviors.MyCourses.LangFrfrBehavior,
	D2L.PolymerBehaviors.MyCourses.LangJaBehavior,
	D2L.PolymerBehaviors.MyCourses.LangKoBehavior,
	D2L.PolymerBehaviors.MyCourses.LangNbBehavior,
	D2L.PolymerBehaviors.MyCourses.LangNlBehavior,
	D2L.PolymerBehaviors.MyCourses.LangPtBehavior,
	D2L.PolymerBehaviors.MyCourses.LangSvBehavior,
	D2L.PolymerBehaviors.MyCourses.LangTrBehavior,
	D2L.PolymerBehaviors.MyCourses.LangZhtwBehavior,
	D2L.PolymerBehaviors.MyCourses.LangZhBehavior
];
