const argv = require("minimist")(process.argv.slice(2));

const today = new Date();
const year = argv["y"] || today.getFullYear();
const month = argv["m"] || today.getMonth() + 1;

const firstDate = new Date(year, month - 1, 1);
const lastDate = new Date(year, month, 0);

const cal = new Array(firstDate.getDay()).fill("  ");
while (firstDate <= lastDate) {
  cal.push(firstDate.getDate().toString().padStart(2, " "));
  firstDate.setDate(firstDate.getDate() + 1);
}

console.log(`      ${month}月  ${year}`);
console.log("日 月 火 水 木 金 土");
for (let i = 0; i < 42; i += 7) {
  console.log(cal.slice(i, i + 7).join(" "));
}
