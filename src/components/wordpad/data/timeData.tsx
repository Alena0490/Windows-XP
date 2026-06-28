export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

export const pad = (n: number) => String(n).padStart(2, '0');

export const DATE_FORMATS: ((d: Date) => string)[] = [
    d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,                                  // 2/10/2026
    d => `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`,                // 2/10/26
    d => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(-2)}`,      // 02/10/26
    d => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`,                        // 02/10/2026
    d => `${String(d.getFullYear()).slice(-2)}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`,      // 26/02/10
    d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,                        // 2026-02-10
    d => `${d.getDate()}-${MONTHS[d.getMonth()].slice(0, 3)}-${String(d.getFullYear()).slice(-2)}`,// 10-Feb-26
    d => `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,    // Tuesday, February 10, 2026
    d => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,                             // February 10, 2026
    d => `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`,    // Tuesday, 10 February, 2026
    d => `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`,                             // 10 February, 2026
];