var models = require('../models/models.js');

//GET /quizzes/question
exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    res.render('quizzes/question', {pregunta: quiz[0].pregunta});
  })
};

//GET /quizzes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    if(req.query.respuesta === quiz[0].respuesta) {
      res.render('quizzes/answer', {respuesta: 'Correcto'});
    } else {
      res.render('quizzes/answer', {respuesta: 'Incorrecto'});
    }
  })
};
