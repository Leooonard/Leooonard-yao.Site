$(function(){
	var $title = $("#title")
	var $upperMask = $("#UpperMask")
	var $lowerMask = $("#LowerMask")
	var $liList = $("li")
	$liList.mouseenter(function(){
		$upperMask.stop(true, true)
		$lowerMask.stop(true, true)
		$title.text($(this).text())
		$upperMask.animate({
			"top" : "0px"
		}, 500, "linear")
		$lowerMask.animate({
			"top" : "0px"
		}, 500, "linear")
	})
	$liList.mouseleave(function(){
		$upperMask.stop(true, false)
		$lowerMask.stop(true, false)
		$upperMask.animate({
			"top" : "30px"
		}, 500, "linear")
		$lowerMask.animate({
			"top" : "-30px"
		}, 500, "linear")
	})
});