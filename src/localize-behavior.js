import 'd2l-localize-behavior/d2l-localize-behavior.js';
import ar from './lang/ar.js';
import dadk from './lang/da-dk.js';
import de from './lang/de.js';
import en from './lang/en.js';
import es from './lang/es.js';
import fi from './lang/fi.js';
import fr from './lang/fr.js';
import frfr from './lang/fr-fr.js';
import ja from './lang/ja.js';
import ko from './lang/ko.js';
import nb from './lang/nb.js';
import nl from './lang/nl.js';
import pt from './lang/pt.js';
import sv from './lang/sv.js';
import tr from './lang/tr.js';
import zh from './lang/zh.js';
import zhtw from './lang/zh-tw.js';

// eslint-disable-next-line sort-imports
import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';

const MyCoursesLocalizeBehaviorImpl = (superClass) => {
	return class extends mixinBehaviors([D2L.PolymerBehaviors.LocalizeBehavior], superClass) {
		static get properties() {
			return {
				resources: {
					value: function() {
						return {
							'en': en,
							'ar': ar,
							'da-dk': dadk,
							'de': de,
							'es': es,
							'fi': fi,
							'fr': fr,
							'fr-fr': frfr,
							'ja': ja,
							'ko': ko,
							'nb': nb,
							'nl': nl,
							'pt': pt,
							'sv': sv,
							'tr': tr,
							'zh': zh,
							'zh-tw': zhtw
						};
					}
				}
			};
		}
	};
};

export const MyCoursesLocalizeBehavior = dedupingMixin(MyCoursesLocalizeBehaviorImpl);
