const argv = require("minimist")(process.argv.slice(2));

const today = new Date();
const year = argv["y"] || today.getFullYear();
const month = argv["m"] || today.getMonth() + 1;

const firstDay = new Date(year, month - 1, 1);
const lastDay = new Date(year, month, 0);

const cal = new Array(firstDay.getDay()).fill("  ");
for (; firstDay <= lastDay; firstDay.setDate(firstDay.getDate() + 1)) {
  cal.push(firstDay.getDate().toString().padStart(2, " "));
}

console.log(`      ${month}月  ${year}`);
console.log("日 月 火 水 木 金 土");
for (let x = 0; x < 42; x += 7) {
  console.log(cal.slice(x, x + 7).join(" "));
}
