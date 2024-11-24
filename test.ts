const x = await fetch("http://localhost:3000/test", {
	method: "post",
	headers: { "content-type": "application/json" },
	body: JSON.stringify({ name: "kkk" }),
});
console.log(x);
const y = await x.json();
console.log(y);

// const xx = await fetch("http://localhost:3000/1/test");
// console.log(xx);
