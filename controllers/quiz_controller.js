var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  console.log("Entra en load= " + quizId);
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};


// GET /quizes
exports.index = function(req, res) {

//añadido para Ejercicio P2P Obligatorio.Tema 7
  var search = '%';
  if (req.query.search){
    search = '%' + req.query.search.replace(/[ ]+/g,'%') + '%';
  }

  models.Quiz.findAll({
        where: ["upper(pregunta) like ?", search.toUpperCase()],
        order: [["pregunta", "ASC"]]
      }).then(function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
      }
      );
};

// GET /quizes/:id
exports.show = function(req, res){
    console.log("Entra en show= " + req.quiz);
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  //guarda en DB los campos pregunta y respuesta de quiz
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};
