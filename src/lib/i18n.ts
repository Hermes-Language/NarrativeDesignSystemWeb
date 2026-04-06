import {
    availableLanguageTags,
    isAvailableLanguageTag,
    languageTag,
    setLanguageTag,
    sourceLanguageTag
} from './paraglide/runtime.js';

export type LibraryLanguageTag = (typeof availableLanguageTags)[number];

const DEFAULT_STORAGE_KEY = 'narrative-design.languageTag';

let hasInitialized = false;

export interface I18nInitOptions {
    languageTag?: string;
    persist?: boolean;
    storageKey?: string;
    syncHtmlLang?: boolean;
}

function normalizeTag(tag: string): string {
    return tag.trim().toLowerCase().replace('_', '-');
}

function toSupportedLanguageTag(candidate?: string): LibraryLanguageTag | undefined {
    if (!candidate) return undefined;

    const normalized = normalizeTag(candidate);
    if (isAvailableLanguageTag(normalized)) {
        return normalized;
    }

    const [base] = normalized.split('-');
    if (base && isAvailableLanguageTag(base)) {
        return base;
    }

    return undefined;
}

function persistLanguageTag(tag: LibraryLanguageTag, storageKey: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(storageKey, tag);
    } catch {
        // Ignore storage errors in restricted environments.
    }
}

function readPersistedLanguageTag(storageKey: string): LibraryLanguageTag | undefined {
    if (typeof localStorage === 'undefined') return undefined;
    try {
        return toSupportedLanguageTag(localStorage.getItem(storageKey) ?? undefined);
    } catch {
        return undefined;
    }
}

function detectBrowserLanguageTag(): LibraryLanguageTag | undefined {
    const candidates: string[] = [];

    if (typeof document !== 'undefined') {
        candidates.push(document.documentElement.lang);
    }

    if (typeof navigator !== 'undefined') {
        candidates.push(...(navigator.languages ?? []));
        candidates.push(navigator.language);
    }

    for (const candidate of candidates) {
        const resolved = toSupportedLanguageTag(candidate);
        if (resolved) return resolved;
    }

    return undefined;
}

function applyHtmlLang(tag: LibraryLanguageTag): void {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = tag;
}

export function resolveLanguageTag(candidate?: string): LibraryLanguageTag {
    return toSupportedLanguageTag(candidate) ?? sourceLanguageTag;
}

export function setLibraryLanguage(tag: string, options: Omit<I18nInitOptions, 'languageTag'> = {}): LibraryLanguageTag {
    const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
    const resolved = resolveLanguageTag(tag);

    setLanguageTag(resolved);

    if (options.syncHtmlLang !== false) {
        applyHtmlLang(resolved);
    }

    if (options.persist !== false) {
        persistLanguageTag(resolved, storageKey);
    }

    return resolved;
}

export function initializeI18n(options: I18nInitOptions = {}): LibraryLanguageTag {
    if (hasInitialized && options.languageTag === undefined) {
        return languageTag();
    }

    const persist = options.persist !== false;
    const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;

    const resolved =
        toSupportedLanguageTag(options.languageTag) ??
        (persist ? readPersistedLanguageTag(storageKey) : undefined) ??
        detectBrowserLanguageTag() ??
        sourceLanguageTag;

    setLanguageTag(resolved);

    if (options.syncHtmlLang !== false) {
        applyHtmlLang(resolved);
    }

    if (persist) {
        persistLanguageTag(resolved, storageKey);
    }

    hasInitialized = true;
    return resolved;
}