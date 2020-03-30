//IMPORT core
var express = require('express');
var app = express();
//import
var fortune = require('./library/fortune.js');
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
var fortune = require('./lib/fortune.js');

var credentials = require('./credentials.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(require('body-parser')());
app.use(require('cookie-parser')(credentials.cookieSecret));

app.get('/about', function (req, res) {
    res.render('about', { fortune: fortune.getFortune() });
});


app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

if (app.thing == null) console.log('bleat!');
// run test
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

// routes
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/newsletter', function (req, res) {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/process', function (req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
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



app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});