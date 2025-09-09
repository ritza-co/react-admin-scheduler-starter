import { mergeTranslations } from 'react-admin';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import {
    raSchedulerLanguageEnglish,
    raSchedulerLanguageFrench
} from '@react-admin/ra-scheduler';

export default polyglotI18nProvider(locale => {
    if (locale === 'fr') {
        return mergeTranslations(frenchMessages, raSchedulerLanguageFrench);
    }
    // Always fallback on english
    return mergeTranslations(englishMessages, raSchedulerLanguageEnglish);
}, 'en');
