
const mobileAgents = ["Android", "iPhone", "iPad", "iPod", "Symbian"];
let userAgent = navigator.userAgent;
window.addEventListener('resize', handleResize)
function handleResize() {
	let flag = mobileAgents.some(ag => navigator.userAgent.includes(ag));
	if (flag !== Common.isMobile) {
		window.location.reload();
	}
}
export const Common = {
	isMobile: mobileAgents.some(ag => userAgent.includes(ag)),
	tg() {
		window.open('https://t.me/todemoon_coin', '_block');
	},
	toTwitter() {
		window.open('', '_block');
	},
	closeNavigationTab() {
	
	}

}
