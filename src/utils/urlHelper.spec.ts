import { isValidUrl, validProtocols } from "./urlHelper";

describe('isValidUrl', () => {
    // Positive test cases
    it('should return true for valid http URLs', () => {
        const result = isValidUrl('http://www.example.com');
        expect(result).toBeTruthy();
    });

    it('should return true for valid https URLs', () => {
        const result = isValidUrl('https://www.example.com');
        expect(result).toBeTruthy();
    });

    it('should return true for URLs containing subdomains and paths', () => {
        const result = isValidUrl('https://sub.example.com/path?query=123');
        expect(result).toBeTruthy();
    });

    // Negative test cases
    it('should return false for URLs with unsupported protocols', () => {
        const result = isValidUrl('ftp://www.example.com');
        expect(result).toBeFalsy();
    });

    it('should return false for URLs missing a dot in the hostname', () => {
        const result = isValidUrl('https://localhost');
        expect(result).toBeFalsy();
    });

    it('should return false for URLs that are not well-formed', () => {
        const result = isValidUrl('ht!tp://@www.example.com');
        expect(result).toBeFalsy();
    });

    it('should return false for URLs with valid protocols but no hostname', () => {
        const result = isValidUrl('http:///');
        expect(result).toBeFalsy();
    });

    it('should return false for empty strings', () => {
        const result = isValidUrl('');
        expect(result).toBeFalsy();
    });

    it('should return false for strings that are not URLs', () => {
        const result = isValidUrl('example string');
        expect(result).toBeFalsy();
    });

    // Checking the protocol directly
    describe('validProtocols', () => {
        it('should contain only http and https', () => {
            expect(validProtocols).toEqual(['http:', 'https:']);
        });
    });
});
