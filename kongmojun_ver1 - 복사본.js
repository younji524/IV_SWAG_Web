const express = require('express');
const ejs = require("ejs");
const app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : '192.168.0.53',
  port     :  3306,
  user     : 'root',
  password : '1234',
  database : 'mysql'
});

connection.connect(function(err)
{
    if(err) throw err;
    console.log("마리아 DB 연동중..");
});

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(__dirname+'/'));

app.get("/", function(req, res)
{
    res.render("kongmojun_ver1.html", {});
});

app.get('/backflow', (req, res) => {
    connection.query('SELECT * FROM backflow_distance ORDER BY DATETIME DESC LIMIT 1', function(err, rows, fields) {
    if (err) throw err;
    result= {datetime: rows[0].datetime, backflow_minute: rows[0].backflow_minute, distance_minute : rows[0].distance_minute}
    console.log(result);
    res.jsonp(result);
});
});

app.post("/postTest", function(req,res)
{
    length = req.body.test
    result = connection.query('INSERT INTO motor(motorlength) VALUES(?)', req.body.test);
    console.log(length)
    res.json({ok:true});
});


app.listen(3000, function()
{
    console.log("실행중..");
});
