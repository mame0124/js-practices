const argv = require("minimist")(process.argv.slice(2));

let today = new Date();
let year = argv["y"] || today.getFullYear();
let month = argv["m"] || today.getMonth() + 1;

let firstDay = new Date(year, month - 1, 1);
let lastDay = new Date(year, month, 0);

let cal = new Array(firstDay.getDay()).fill("  ");
for (firstDay; firstDay <= lastDay; firstDay.setDate(firstDay.getDate() + 1)) {
  if (firstDay.getDate() < 10) {
    cal.push(" " + firstDay.getDate());
  } else {
    cal.push(firstDay.getDate());
  }
}

console.log(`      ${month}月  ${year}`);
console.log("日 月 火 水 木 金 土");
for (let x = 0; x < 42; x += 7) {
  console.log(cal.slice(x, x + 7).join(" "));
}
