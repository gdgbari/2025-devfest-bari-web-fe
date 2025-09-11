import { ui, defaultLang, showDefaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        const result = (ui[lang][key] || ui[defaultLang][key]);
        if (!result) {
            console.warn(`Missing translation for key "${key}" in language "${lang}"`);
        }
        return (result ?? "ERROR: translation missing") as string;
    }
}

export function useTranslationsData(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        const result = (ui[lang][key] || ui[defaultLang][key]);
        if (!result) {
            console.warn(`Missing translation for key "${key}" in language "${lang}"`);
        }
        return result;
    }
}

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        let translatedPath = !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;

        if (translatedPath === '') {
            translatedPath = '/';
        }

        return translatedPath;
    }
}

export function getUrlPathWithoutLang(lang: keyof typeof ui, url: URL) {
    const result = url.pathname.replace(`/${lang}`, '');
    return result;
}