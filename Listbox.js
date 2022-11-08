const listbox = document.querySelector(".list");
const listItems = [...document.querySelectorAll(".item")];
const pTag = document.querySelector(".selected-text");

//selected item = item with aria-selected = 'true'
//active item = item with 'item--selected' focus class
const findActiveItem = (shouldRemoveClass) => {
	//find active item
	const activeItem = listItems.find((item) =>
		item.classList.contains("item--selected")
	);
	//if boolean true is passed as a param
	//remove class from active item
	if (shouldRemoveClass) {
		activeItem.classList.remove("item--selected");
	}
	return activeItem;
};

const setItem = (item) => {
	item.classList.add("item--selected");
	item.scrollIntoView({
		behavior: "smooth",
		block: "nearest",
	});
};

//-----------------------------------------------------------------

const listItemContent = listItems.map((item) =>
	item.textContent.toLowerCase().trim()
);

const debounceSearch = (fn, timeout = 1000, ...args) => {
	let timer;
	let keysPressed = [];
	let keysPressedHistory = [];
	return (e) => {
		const pressedKey = e.key.toLowerCase();
		keysPressed.push(pressedKey);
		keysPressedHistory.push(pressedKey);
		const textToBeMatched = keysPressed.join("");
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn(keysPressed, textToBeMatched, keysPressedHistory);
		}, timeout);
	};
};

const searchAndSet = (keysPressed, textToBeMatched, keysPressedHistory) => {
	//find first item in list whose
	//first letter/s match the
	//user typed text
	const performSearch = () => {
		//reset keysPressed array whenever invoked
		keysPressed.length = 0;
		//find index of user typed text in
		// listItems using regex
		const no = listItemContent.findIndex((itemContent) =>
			itemContent.match(`^(${textToBeMatched})`)
		);
		// console.log(no);

		if (no === -1) return;
		findActiveItem(true);
		setItem(listItems[no]);
	};
	// console.log(keysPressed);
	// console.log(keysPressedHistory);

	//check if newly pressed key matches
	//the first letter (if multiple letters like 'abc') of
	//the previously pressed key/s
	//if true -> navigate down
	if (
		keysPressed.length === 1 &&
		keysPressed[0] === keysPressedHistory[keysPressedHistory.length - 1]
	) {
		const character = keysPressed[0];
		const activeItem = findActiveItem();

		const next = activeItem.nextElementSibling;
		//if active item = last item
		//then perform check
		if (!next) {
			performSearch();
			return;
		}
		//using regex, check whether newly pressed key
		//matches the first letter of the
		//next item in the list
		const condition = next.textContent
			.toLocaleLowerCase()
			.trim()
			.match(`^${character}`);

		//if true -> navigate down
		if (condition) {
			activeItem.classList.remove("item--selected");
			setItem(next);
			keysPressed.length = 0;
			return;
		} else {
			//else go to first element in list
			//whose first character matches
			//newly pressed key
			performSearch();
			return;
		}
	}

	performSearch();
};

//----------------------------------------------------------------------------

listbox.addEventListener("keydown", (e) => {
	const key = e.key.toLowerCase();
	if (key === "arrowdown") {
		e.preventDefault(); //prevent scroll

		const activeItem = findActiveItem(true);
		const nextItem = activeItem.nextElementSibling;

		//if next item = undefined
		//set first item as active
		if (!nextItem) {
			setItem(listItems[0]);
		} else {
			setItem(nextItem);
		}
	}
	if (key === "arrowup") {
		e.preventDefault(); //prevent scroll

		const activeItem = findActiveItem(true);
		const prevItem = activeItem.previousElementSibling;

		//if prev item = undefined
		//set last item as active
		if (!prevItem) {
			setItem(listItems[listItems.length - 1]);
		} else {
			setItem(prevItem);
		}
	}
	if (key === "enter" || key === " ") {
		e.preventDefault();
		//find previously selected item using
		//aria selected attribute
		const prevSelectedItem = listItems.find(
			(item) => item.ariaSelected === "true"
		);
		//set aria selected attribute of
		//prev selected item to false and
		//set it to true for active item
		prevSelectedItem.ariaSelected = "false";
		const activeItem = findActiveItem(false);
		activeItem.ariaSelected = "true";
		pTag.textContent = activeItem.textContent;
	}
	if (key === "home") {
		//navigate to first item
		const activeItem = findActiveItem(true);
		setItem(listItems[0]);
	}
	if (key === "end") {
		//navigate to last item
		const activeItem = findActiveItem(true);
		setItem(listItems[listItems.length - 1]);
	}
});

listbox.addEventListener("keydown", debounceSearch(searchAndSet, 150));

//-------------------------- unrelated ---------------------------------
// const btn = document.querySelector("button");
// const debounce = () => {
// 	let timer;
// 	return () => {
// 		if (timer) clearInterval(timer);
// 		timer = setTimeout(() => {
// 			console.log("first");
// 		}, 150);
// 	};
// };
// btn.addEventListener("keydown", debounce());
