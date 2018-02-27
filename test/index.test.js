/* global describe it */
import {
	createHostingCFGStringFromObject
	// createObjectFromHostingCFGString
} from '../src';

import {
	// mockHostingCFgString,
	mockHostingCFGObj,
	mockHostingCFgStringFormatted
} from './mock-hosting';

describe('Decode Encode', () => {
	it('Create hosting CFG string from object', () => {
		expect(createHostingCFGStringFromObject(mockHostingCFGObj)).toBe(
			mockHostingCFgStringFormatted
		);
	});

	// it('Create object from hosting CFG string', () => {
	// 	expect(createObjectFromHostingCFGString(mockHostingCFgString)).toBe(
	// 		mockHostingCFGObj
	// 	);
	// });
});
