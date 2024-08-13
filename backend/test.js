const fs = require('fs');
let dataAll
fs.readFile('./test.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  dataAll = data
  console.log(data);
  fs.writeFile('./result.json', JSON.stringify(`${data}`), (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
}); 
});