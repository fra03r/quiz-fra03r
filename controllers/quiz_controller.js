var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
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
      ).catch(function(error){next(error)});
};

// GET /quizes/:id
exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz})
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
