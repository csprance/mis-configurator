/* eslint-disable no-dupe-keys */
// @flow
export const mockHostingCFgString: string = `# Example Miscreated hosting.cfg file

# Change this to your own cool name
sv_servername=My Miscreated Game Server


# make sure to create a strong password
http_password=coolp@s$w0r|)

wm_timeScale=3

wm_forceTime=-1

g_pingLimit=0

g_pingLimitTimer=15.0

g_idleKickTime=300

g_gameRules_Camera=0



schedule_shutdown_utc=5.0
schedule_shutdown_utc=17.0
`;

export const mockHostingCFGObj: Object = {
	sv_servername: 'My Miscreated Game Server',
	http_password: 'coolp@s$w0r|)',
	wm_timeScale: 3,
	wm_forceTime: -1,
	g_pingLimit: 0,
	g_pingLimitTimer: 15.0,
	g_idleKickTime: 300,
	g_gameRules_Camera: 0,
	schedule_shutdown_utc: [5.5, 17.0]
};

export const mockHostingCFgStringFormatted: string = `sv_servername=My Miscreated Game Server
http_password=coolp@s$w0r|)
wm_timeScale=3
wm_forceTime=-1
g_pingLimit=0
g_pingLimitTimer=15
g_idleKickTime=300
g_gameRules_Camera=0
schedule_shutdown_utc=5.5
schedule_shutdown_utc=17
`;
