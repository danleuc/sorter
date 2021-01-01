const express = require('express');
require('dotenv').config();
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('/public/index.html');
})

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; Press Ctrl-C to terminate.`);
})