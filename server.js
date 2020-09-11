const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose')

const app = express();
const port = process.env.PORT || 4000;

const inventoryRoutes = require('./routes/inventory')

// Pulling in credentials from file
var credentials = require('./credentials.json');

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());

// Connection URL
const uri = 
'mongodb+srv://' +
credentials.env.MONGO_ATLAS_USER + ':' + 
credentials.env.MONGO_ATLAS_PW + '@mern-web-app.u9rbc.mongodb.net/' +
credentials.env.MONGO_ATLAS_DB + '?retryWrites=true&w=majority'

// Initialize Connection Once and Create Connection Pool
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true},
    function(err) {
        if (err) throw err;
        console.log('Database Connected');
    })

// Routes that should handle requests
app.use('/inv', inventoryRoutes);

// Catch errors that go beyond the above routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

// Passes direct errors
app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(port, function() {
    console.log("Server is running on Port: " + port)
})