var ContentDispatcher = {}
ContentDispatcher.main = function(req , res){
	res.render('main')
	return true;
}

module.exports = ContentDispatcher
