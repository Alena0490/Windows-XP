export const typeIntoActiveElement = (char: string) => {
    const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) return;

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;

    const nativeSetter = Object.getOwnPropertyDescriptor(
        el.tagName === 'TEXTAREA'
            ? window.HTMLTextAreaElement.prototype
            : window.HTMLInputElement.prototype,
        'value'
    )?.set;

    const newValue = el.value.slice(0, start) + char + el.value.slice(end);
    nativeSetter?.call(el, newValue);
    el.selectionStart = el.selectionEnd = start + char.length;
    el.dispatchEvent(new Event('input', { bubbles: true }));
};