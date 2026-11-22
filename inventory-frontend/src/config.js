// App-wide constants. Change currency/locale here and every price updates.
export const APP_NAME = 'Stockroom';
export const APP_TAGLINE = 'IT hardware inventory';

export const CURRENCY = 'INR';
export const LOCALE = 'en-IN';

export const PAGE_SIZES = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 20;

// Client-side guard only. The real limit is set on the backend
// (spring.servlet.multipart.max-file-size).
export const MAX_IMAGE_MB = 5;
