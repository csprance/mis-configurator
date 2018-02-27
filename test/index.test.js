/* global describe it */
import {
	createHostingCFGStringFromObject,
	createObjectFromHostingCFGString
} from '../src';

import {
	mockHostingCFgString,
	mockHostingCFGObj,
	mockHostingCFgStringFormatted
} from './mock-hosting';

describe('transform', () => {
	it('transforms a js object', () => {
		expect(createHostingCFGStringFromObject(mockHostingCFGObj)).toBe(
			mockHostingCFgStringFormatted
		);
	});

	it('transforms a cfg string', () => {
		expect(createObjectFromHostingCFGString(mockHostingCFgString)).toBe(
			mockHostingCFGObj
		);
	});
});
