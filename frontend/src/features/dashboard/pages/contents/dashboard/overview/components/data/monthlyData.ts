const generateDailyData = () => [
	{ name: "Mon", fullName: "Monday", appointments: Math.floor(Math.random() * 5) + 1 },
	{ name: "Tue", fullName: "Tuesday", appointments: Math.floor(Math.random() * 5) + 1 },
	{ name: "Wed", fullName: "Wednesday", appointments: Math.floor(Math.random() * 5) + 1 },
	{ name: "Thu", fullName: "Thursday", appointments: Math.floor(Math.random() * 5) + 1 },
	{ name: "Fri", fullName: "Friday", appointments: Math.floor(Math.random() * 5) + 1 },
	{ name: "Sat", fullName: "Saturday", appointments: Math.floor(Math.random() * 5) + 1 },
	{ name: "Sun", fullName: "Sunday", appointments: Math.floor(Math.random() * 5) + 1 },
];

const generateWeeklyData = (month: number, year: number) => {
	const weeks = [];
	let startDate = new Date(year, month, 1);
	let endDate = new Date(year, month + 1, 0);
	let weekNumber = 1;

	while (startDate < endDate) {
		let weekStart = new Date(startDate);
		let weekEnd = new Date(startDate);
		weekEnd.setDate(weekEnd.getDate() + 6);

		if (weekEnd > endDate) {
			weekEnd = endDate;
		}

		weeks.push({
			name: `Week ${weekNumber}`,
			fullName: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
			appointments: Math.floor(Math.random() * 10) + 5,
			dailyData: generateDailyData(),
		});

		startDate.setDate(startDate.getDate() + 7);
		weekNumber++;
	}

	return weeks;
};

export const monthlyData = [
	{
		name: "Jan",
		fullName: "January",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(0, 2024),
	},
	{
		name: "Feb",
		fullName: "February",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(1, 2024),
	},
	{
		name: "Mar",
		fullName: "March",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(3, 2024),
	},
	{
		name: "Apr",
		fullName: "April",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(4, 2024),
	},
	{
		name: "May",
		fullName: "May",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(5, 2024),
	},
	{
		name: "Jun",
		fullName: "June",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(6, 2024),
	},
	{
		name: "Jul",
		fullName: "July",
		appointments: Math.floor(Math.random() * 100) + 20,
		weeklyData: generateWeeklyData(7, 2024),
	},
];
