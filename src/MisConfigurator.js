/* eslint-disable no-continue,no-plusplus,prefer-destructuring,no-param-reassign */
// @flow
/** MisConfigurator
 * project: mis-configurator
 * author: Chris Sprance - csprance
 */
import { saneDefaults } from './saneDefaults';

export type MisConfiguratorOptions = {
	lineEnding: string,
	sectionOpenIdentifier: string,
	sectionCloseIdentifier: string,
	defaultValue: boolean,
	assignIdentifier: string,
	commentIdentifiers: Array<string>,
	trimLines: boolean
};

export const defaultOptions = {
	lineEnding: '\n',
	sectionOpenIdentifier: '[ ',
	sectionCloseIdentifier: ']',
	defaultValue: true,
	assignIdentifier: '=',
	commentIdentifiers: ['#'],
	trimLines: true
};

/**
 * Encode and decode Miscreated hosting.cfg files
 * decode to get a simple js object / encode to get a config-String
 * @author Csprance - Based off of config-cfg-ini
 * @licence MIT
 */
export default class MisConfigurator {
	options: MisConfiguratorOptions;
	constructor(options: MisConfiguratorOptions = defaultOptions) {
		this.options = options;
	}

	/**
	 * Decode a config-string
	 * @param data {string}
	 * @return object
	 */
	decode(data: string): Object {
		const lines = data.split(this.options.lineEnding);
		const linesNonEmpty = lines.filter(line => line.length > 0);
		const linesCommentsStripped = linesNonEmpty.filter(
			line =>
				!MisConfigurator.stringBeginsWithOnOfTheseStrings(
					line,
					this.options.commentIdentifiers
				)
		);
		const trimmedLines = linesCommentsStripped.filter(
			line => (this.options.trimLines ? line.trim() : line)
		);
		const keyValuePairs = trimmedLines.map(line =>
			line.split(this.options.assignIdentifier)
		);
		const duplicateKeys = MisConfigurator.getDuplicatedKeys(keyValuePairs);
		const keyValuePairsDupesRemoved = keyValuePairs.filter(
			item => !duplicateKeys.includes(item[0])
		);
		const keyValuePairsDupesOnly = keyValuePairs.filter(item =>
			duplicateKeys.includes(item[0])
		);
		const deDuplicatedKeyValues = Object.entries(
			keyValuePairsDupesOnly.reduce((acc, inVal) => {
				const key = inVal[0];
				const val = inVal[1];
				acc[key] = [].concat(acc[key], val);
				return acc;
			}, Object.assign({}, ...duplicateKeys.map(key => ({ [key]: [] }))))
		);
		const decodedResults = []
			.concat(deDuplicatedKeyValues, keyValuePairsDupesRemoved)
			.reduce((acc, val) => {
				acc[val[0]] = val[1];
				return acc;
			}, {});

		// TODO: Maybe some verification on the object here?
		return decodedResults;
	}

	/**
	 * Gets any keys that are duplicates
	 * * @param keyValuePairs [['key1'], 'value1'], ['key2', 'value2'], ['key1', 'value3']]
	 * @return Array<string> ['key1']
	 */
	static getDuplicatedKeys(keyValuePairs: Array<Array<string>>): Array<string> {
		const getKeys = (acc, val) => acc.concat(val[0]);
		const unique = keyValuePairs
			.reduce(getKeys)
			.map(name => ({ count: 1, name }))
			.reduce((a, b) => {
				a[b.name] = (a[b.name] || 0) + b.count;
				return a;
			}, {});

		return Object.keys(unique).filter(a => unique[a] > 1);
	}

	/**
	 * Encode an object
	 * no nesting section supported!
	 * @param object {object}
	 * @return {string}
	 */
	encode(object: Object): string {
		let resultSections = '';
		let resultAttributesWithoutSection = '';
		const sections = Object.keys(object);
		for (let i = 0; i < sections.length; i++) {
			if (typeof object[sections[i]] === 'object') {
				if (resultSections !== '') {
					resultSections += this.options.lineEnding;
				}
				const attributes = Object.keys(object[sections[i]]);
				for (let j = 0; j < attributes.length; j++) {
					resultSections += sections[i];
					resultSections += this.options.assignIdentifier;
					resultSections += object[sections[i]][attributes[j]];
					resultSections += this.options.lineEnding;
				}
			} else {
				resultAttributesWithoutSection += sections[i];
				resultAttributesWithoutSection += this.options.assignIdentifier;
				resultAttributesWithoutSection += object[sections[i]];
				resultAttributesWithoutSection += this.options.lineEnding;
			}
		}
		return resultAttributesWithoutSection + resultSections;
	}

	/**
	 * Try to detect the used line ending
	 * (windows, unix, mac)
	 * @return string
	 */
	static detectLineEnding(data: string): string {
		const hasCarriageReturn = data.indexOf('\r') !== -1;
		const hasLineFeed = data.indexOf('\n') !== -1;
		if (hasCarriageReturn && hasLineFeed) {
			if (data.indexOf('\r\n') !== -1) {
				return '\r\n';
			} else if (data.indexOf('\n\r') !== -1) {
				return '\n\r';
			}
			throw new Error('found multiple line endings');
		} else if (hasLineFeed) {
			return '\n';
		} else if (hasCarriageReturn) {
			return '\r';
		} else {
			return '\n';
		}
	}

	/**
	 * Figures out if a string begins with one of the string
	 * (windows, unix, mac)
	 * @return string
	 */
	static stringBeginsWithOnOfTheseStrings(
		string: string,
		stringList: Array<string>
	): boolean {
		for (let i = 0; i < stringList.length; i++) {
			if (string.indexOf(stringList[i]) === 0) {
				return true;
			}
		}
		return false;
	}
}

/**
 * This takes a javascript object and transforms it to a hosting.cfg string.
 * @param data The javascript object to transform.
 * @returns a hosting.cfg string.
 */
export function createHostingCFGStringFromObject(
	data: Object = { http_password: 'password' }
): string {
	const misConfig = new MisConfigurator();
	return misConfig.encode(data);
}

/**
 * This takes a hosting.cfg string and transforms it to a javascript object
 * @param str The string hosting.cfg to transform.
 * @returns a javascript object
 */
export function createObjectFromHostingCFGString(
	str: string = saneDefaults
): Object {
	const misConfig = new MisConfigurator();
	return misConfig.decode(str);
}
