async function getData() {
	const data = await fetch('../static/js/json/data.json'),
		del = await data.json()
	return del
}

async function render() {
	const data = await getData();
	// console.log(data);
}
render()