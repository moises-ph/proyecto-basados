var req = new XMLHttpRequest;
var DATA = {};
req.open('GET', 'http://localhost:3000/dashboard/data', false);
req.send(null);
if (req.status == 200) {
    DATA = JSON.parse(req.responseText);
    console.log(DATA)
}