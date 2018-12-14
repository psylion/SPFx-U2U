const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});
 
app.listen(8080, (error) => {
    if (error) {
        return console.log('ERROR: ', error)
    }

    console.log('Server is listening on 8080. Navigate to: http://localhost:8080');
    open("http://localhost:8080");
});