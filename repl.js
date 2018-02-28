// @flow
/** repl
 * project: mis-configurator
 * author: Chris Sprance - csprance
 * description:
 */
import {
	// createHostingCFGStringFromObject,
	createObjectFromHostingCFGString
} from './src';

import {
	mockHostingCFgString
} from './test/mock-hosting';


// const mockHostingCFGObj : Object = {
// 	sv_serverame: 'My Miscreated Ga7me Server',
// 	http_password: 'coolp@s$w0r|)',
// 	wm_timeScale: 3,
// 	wm_forceTime: -1,
// 	g_pingLimit: 0,
// 	g_pingLimitTimer: 5.0,
// 	g_idleKickTime: 300,
// 	g_gameRules_Camera: 0,
// 	schedule_shutdown_utc: [5.0, 17.0]
// };

// const dataObj = createHostingCFGStringFromObject(mockHostingCFGObj);
// console.log(dataObj);

const dataStr = createObjectFromHostingCFGString(mockHostingCFgString);
console.log(dataStr);
