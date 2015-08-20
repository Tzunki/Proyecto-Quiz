var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos
router.param('quizId', quizController.load); //Autoload :quizId
router.param('commentId', commentController.load); //Autoload :commentId

// Rutas de sesión
router.get('/login',  sessionController.new);     //formulario login
router.post('/login', sessionController.create);  //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión

// Rutas de /quizzes
router.get('/quizzes',                      quizController.index);
router.get('/quizzes/:quizId(\\d+)',        quizController.show);
router.get('/quizzes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizzes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizzes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizzes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

// Rutas de comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',    commentController.create);
router.get('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
  sessionController.loginRequired, commentController.publish);

// Ruta de estadísticas
router.get('/quizzes/statistics', statisticsController.index);

// Ruta de author
router.get('/author', function(req, res) {
  res.render('author', { errors: []});
});

module.exports = router;
