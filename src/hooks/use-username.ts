import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const STORAGE_KEY = "chat_username";
const ADJECTIVE = [
	"swift",
	"brave",
	"outrageous",
	"clever",
	"fierce",
	"loyal",
	"wise",
	"bold",
	"fearless",
	"vigilant",
	"radiant",
	"mighty",
	"nimble",
	"sly",
	"gallant",
	"stalwart",
	"valiant",
	"tenacious",
	"dauntless",
	"resilient",
];
const ANIMALS = [
	"dog",
	"cat",
	"lion",
	"tiger",
	"bear",
	"wolf",
	"eagle",
	"hawk",
	"shark",
	"dolphin",
	"whale",
	"fox",
	"deer",
	"rabbit",
	"squirrel",
	"otter",
	"penguin",
	"kangaroo",
	"panda",
	"giraffe",
	"zebra",
];

const generateUsername = () => {
	const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
	const adjective = ADJECTIVE[Math.floor(Math.random() * ADJECTIVE.length)];
	return `${adjective}-${animal}-${nanoid(5)}`;
};

export const useUsername = () => {
	const [username, setUsername] = useState("");
	useEffect(() => {
		const main = () => {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				setUsername(stored);
				return;
			}
			const generated = generateUsername();
			localStorage.setItem(STORAGE_KEY, generated);
			setUsername(generated);
		};
		main();
	}, []);

	return { username };
};
