const tips = [
	"Loren ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at tincidunt lectus. Donec vitae nibh eget massa congue aliquam.",
	"Suspendisse potenti. In faucibus massa arcu, vitae cursus mi hendrerit nec.",
	"Curabitur nec nulla blandit, auctor est a, semper ligula.",
	"Sed non magna ornare, fermentum ipsum eu, suscipit odio.",
	"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
	"Donec sed sem sit amet lorem volutpat tincidunt.",
	"Vivamus ac augue in magna gravida consequat.",
	"Maecenas at lectus sed orci efficitur congue.",
	"Praesent vel massa sit amet lorem sollicitudin efficitur.",
	"Praesent auctor, massa nec tincidunt scelerisque, tortor ex pharetra magna, non congue diam odio id orci.",
	"Nulla facilisi. Vivamus non ante sit amet magna lacinia efficitur.",
	"Morbi auctor, sapien eget lobortis efficitur, magna orci tincidunt elit, sit amet congue justo nisi vitae lacus.",
	"Nulla facilisi. Vivamus non ante sit amet magna lacinia efficitur.",
	"magna orci tincidunt elit, Morbi auctor, sapien eget lobortis efficitur, sit amet congue justo nisi vitae lacus.",
];

export function getRandomTip() {
	const randomIndex = Math.floor(Math.random() * tips.length);
	return { tip: tips[randomIndex], number: randomIndex + 1 };
}
