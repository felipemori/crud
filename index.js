var restify = require('restify');
const errs = require('restify-errors');
const serverrestify = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'db'
    }
});


serverrestify.get('/', restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'

}));

serverrestify.use(restify.plugins.acceptParser(serverrestify.acceptable));
serverrestify.use(restify.plugins.queryParser());
serverrestify.use(restify.plugins.bodyParser());

serverrestify.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

serverrestify.listen(8080, function () {
  console.log('%s listening at %s', serverrestify.name, serverrestify.url);
});



serverrestify.post('/create', function (req, res, next) {
  knex('task')
  .insert(req.body)
  .then((dados)=>{
    res.send(dados)

  }, next)

  return next();
})

serverrestify.get('/read', function (req, res, next) {

  knex('task').then((dados)=>{
    res.send(dados)
  },next)

  return next();
});

serverrestify.put('/update/:id', function (req, res, next) {
  const{id} = req.params
  
    knex('task')
      .update(req.body)
      .where('id',id)
      .then((dados)=>{
        if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
      res.send("atualizado com sucesso")
    },next)
  
    return next();
  });
  
  serverrestify.del('/delete/:id', function (req, res, next) {
    const{id} = req.params
    
      knex('task')
        .delete()
        .where('id',id)
        .then((dados)=>{
          if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
        res.send("deletado com sucesso")
      },next)
    
      return next();
    });

    serverrestify.get('/get/:id', function (req, res, next) {
      const {id} = req.params
      knex('task').where('id', id).then((dados)=>{
        res.send(dados)
      },next)
    
      return next();
    });