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

describe('Decode Encode', () => {
	it('Create hosting CFG string from object - Encode', () => {
		expect(createHostingCFGStringFromObject(mockHostingCFGObj)).toEqual(
			mockHostingCFgStringFormatted
		);
	});

	it('Create object from hosting CFG string - Decode', () => {
		expect(createObjectFromHostingCFGString(mockHostingCFgString)).toEqual(
			mockHostingCFGObj
		);
	});
});
