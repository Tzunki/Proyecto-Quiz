var models = require('../models/models.js');

//Objeto que contiene todas las estadísticas a mostrar
var statistics = {
  numQuizzes: 0,
  numComments: 0,
  averageCommentsByQuiz: 0,
  numQuizzesWithoutComments: 0,
  numQuizzesWithComments: 0
};

var errors = [];

//GET /quizzes/statistics
exports.index = function(req, res) {
  //Calculamos todas las estadísticas y las vamos asignando al objeto statistics
  //Número de Quizzes
  models.Quiz.count().then(function(numQuizzes){
    statistics.numQuizzes = numQuizzes;
    return models.Comment.count();     //Número de Comments
  }).then(function(numComments){
    statistics.numComments = numComments;
    statistics.averageCommentsByQuiz = numComments/statistics.numQuizzes; //Cálculo de la media de Comments/Quiz
    return models.Quiz.findAndCountAll({   //Número de Quizzes con Comentario
        include: [{
            model: models.Comment,
            required: true,
            where: {
              publicado: true
            }
        }]
    });
  }).then(function(numQuizzesWithComments){
    statistics.numQuizzesWithComments = numQuizzesWithComments.count;
    statistics.numQuizzesWithoutComments = statistics.numQuizzes - numQuizzesWithComments.count; //Número de Quizzes sin Comentario
  })
  .catch(function(error) {next(error);})
  //Finalmente cargamos la vista de las estadísticas pasándole el objeto con los cálculos
  .finally(function(){
    res.render('statistics.ejs', { statistics: statistics, errors: errors});
  });
};
