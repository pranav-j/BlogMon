require('./config/dbConfig'); // this is IMPORTANT, it makes the DB connect

const express = require('express');
const cors = require('cors');
const routes = require('./routes/router.js')

const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());

app.use(cookieParser());


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// this is required if you haven't set the proxy port in react to the port at 
// which server is running (port 3000 is the default port for react)

app.use(routes);

app.use(express.static("build"));

app.use('/img-uploads', express.static('img-uploads'));


const PORT = process.env.PORT || 3535;
app.listen(PORT, () => {
    console.log('Server started on............... : ', PORT);
});