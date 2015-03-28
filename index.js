var express = require('express')
var app = express()
var request = require('superagent')
var bodyParser = require('body-parser')

app.use(bodyParser.json());

app.post('/gateway', function (req, res) {
  var body = {
    attachments: [
      {
        fallback: req.body.object_kind + ' on <' + req.body.repository.homepage + '|' + req.body.repository.name + '>',
        pretext: req.body.object_kind + ' on <' + req.body.repository.homepage + '|' + req.body.repository.name + '>',
        color: "#D00000",
        fields: []
      }
    ]
  }



  if(req.body.commits.length > 0){
    console.log(req.body.commits)

    body.attachments[0].fields.push({
        title: 'Comment',
        value: req.body.commits[0].message,
        short: false
      })
  }

  request
    .post('https://hooks.slack.com/services/'+req.query.slack)
    .send(body)
    .end(function(err, resp){
      if(err){
        res.send(err)
        }else{
          res.send(resp)
        }
    })

})

app.listen((process.env.PORT || 5000))
