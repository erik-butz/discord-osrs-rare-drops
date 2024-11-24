const fs = require("fs");
csv = fs.readFileSync('whitelistItems.txt');


const array = csv.toString().split("\r");

// All the rows of the CSV will be
// converted to JSON objects which
// will be added to result in an array
let result = [];

// The array[0] contains all the
// header columns so we store them
// in headers array
let headers = array[0].split(", ");
console.log(headers);
