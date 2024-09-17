export const validProtocols = ['http:', 'https:'];
export const isValidUrl = (url: string): boolean => {
    try {
        const urlObject = new URL(url);

        if (!validProtocols.includes(urlObject.protocol)) {
            return false;
        }

        if (!urlObject.hostname.includes('.')) {
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}