var express = require('express')
var app = express()
var request = require('superagent')
var bodyParser = require('body-parser')

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.redirect('https://github.com/matteocrippa/gitlab2slack')
})

app.post('/gateway', function (req, res) {

  var body = {
    attachments: [
      fallback: '',
      pretext: '',
      color: '',
      fields: []
    ]
  }

  switch(req.body.object_kind){
    case 'push':
      body.attachments[0].fallback = 'Push - <' + req.body.repository.homepage + '|' + req.body.repository.name + '>'
      body.attachments[0].pretext = 'Push - <' + req.body.repository.homepage + '|' + req.body.repository.name + '>'
      body.attachments[0].color = '#00D000'
      req.body.commits.forEach(function(item){
        body.attachments[0].fields.push({
          title: 'Commit by ' + item.author.name,
          value: item.message,
          short: false
        })
      })
      break;
    case 'issue':
      body.attachments[0].fallback = req.body.object_attributes.action +' issue by ' + req.body.user.name
      body.attachments[0].pretext = req.body.object_attributes.action +' issue by ' + req.body.user.name
      body.attachments[0].color = '#D00000'
      body.attachments[0].fields.push({
        title: req.body.object_attributes.title,
        value: req.body.object_attributes.description,
        short: false
      })
      break;
    default:
      break;
  }

  var body = {
    attachments: [
      {
        fallback: req.body.object_kind + ' on ,
        pretext: req.body.object_kind + ' on <' + req.body.repository.homepage + '|' + req.body.repository.name + '>',
        color: "#00D000",
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
