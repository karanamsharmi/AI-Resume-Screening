// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CI-friendly test helper: set `window.__REQUIRE_AUTH__ = false` during test runs
// or when REACT_APP_TEST_REQUIRE_AUTH is explicitly set to 'false'. This lets
// tests run without requiring an auth token by default.
if (typeof window !== 'undefined') {
	try {
		const isTest = process.env.NODE_ENV === 'test';
		const ci = process.env.CI === 'true' || process.env.CI === true;
		const envFlag = process.env.REACT_APP_TEST_REQUIRE_AUTH;
		if (isTest || ci || envFlag === 'false') {
			window.__REQUIRE_AUTH__ = false;
		}
	} catch (e) {
		// ignore
	}
}
