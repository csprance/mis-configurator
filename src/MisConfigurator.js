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
		const result = {};
		let currentSection;
		const lines = data.split(this.options.lineEnding);

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			if (this.options.trimLines === true) {
				line = line.trim();
			}
			if (
				line.length === 0 ||
				MisConfigurator.stringBeginsWithOnOfTheseStrings(
					line,
					this.options.commentIdentifiers
				)
			) {
				continue;
			}

			const sectionRegExp = new RegExp(
				`^\\${this.options.sectionOpenIdentifier}(.*?)\\${
					this.options.sectionCloseIdentifier
				}$`
			);
			const newSection = line.match(sectionRegExp);
			if (newSection !== null) {
				currentSection = newSection[1];
				if (typeof result[currentSection] === 'undefined') {
					result[currentSection] = {};
				}
				continue;
			}

			const assignPosition = line.indexOf(this.options.assignIdentifier);
			let key;
			let value;
			if (assignPosition === -1) {
				key = line;
				value = this.options.defaultValue;
			} else {
				key = line.substr(0, assignPosition);
				value = line.substr(
					assignPosition + this.options.assignIdentifier.length
				);
			}

			if (typeof currentSection === 'undefined') {
				result[key] = value;
			} else {
				result[currentSection][key] = value;
			}
		}

		return result;
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
