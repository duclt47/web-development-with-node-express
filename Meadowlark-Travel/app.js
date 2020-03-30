//IMPORT
var express = require('express');
var app = express();
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
var fortune = require('./lib/fortune.js');

var credentials = require('./credentials.js');


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.get('/about', function (req, res) {
    res.render('about', { fortune: fortune.getFortune() });
});

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/test-cookie', function (req, res) {
    // res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom', { signed: true });
    res.render('about');
})
// 404 catch-all handler (middleware)
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});