const request = require('request');
const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials')
app.set('view-engine','hbs');

hbs.registerHelper('getasdf', (score) => {
    if (score.homeTeam == null) {
        return 'To be played';
    } else {
        return score.homeTeam;
    }
});

app.get('/', (req, res) => {
    res.render('home.hbs');
})

// app.get('/standings', (req, res) => {
//     res.render('standings.hbs');
// })

// app.get('/fixures', (req, res) => {
//     res.render('fixures.hbs');
// })

// app.get('/teams', (req, res) => {
//     res.render('teams.hbs');
// })

app.get('/standings', (req, res) => {
    var league = req.query.leagueI;
    if (!league) league = 2014;
    request.get({
        url : `http://api.football-data.org/v2/competitions/${league}/standings`,
        headers: {'X-Auth-Token': '9149ee5b63f44ceb9e649d5b432beca5'},
        json: true
    }, (error, response, body) => {
        let stand = body.standings[0].table;
        let head = [1];
        res.render('standings.hbs', {
            standings: stand,
            head: head
        });
    })
})

app.get('/fixures', (req, res) => {
    var league = req.query.leagueI;
    if (!league) league = 2014;
    request.get({
        url : `http://api.football-data.org/v2/competitions/${league}/matches`,
        headers: {'X-Auth-Token': '9149ee5b63f44ceb9e649d5b432beca5'},
        json: true
    }, (error, response, body) => {
        let matches = body.matches;
        let head = [1];
        res.render('fixures.hbs', {
            matches: matches,
            head: head
        });
    })  
})

app.get('/teams', (req, res) => {
    var league = req.query.leagueI;
    if (!league) league = 2014;
    request.get({
        url : `http://api.football-data.org/v2/competitions/${league}/teams`,
        headers: {'X-Auth-Token': '9149ee5b63f44ceb9e649d5b432beca5'},
        json: true
    }, (error, response, body) => {
        res.render('teams.hbs', {
            teams: body.teams,
            head: [1]
        });
    })  
})

app.listen(3000, () => {
    console.log('Server is up and running on Port 3000');
});