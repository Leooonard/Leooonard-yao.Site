(function(){
	var SVGHelper = function(settings){
		var commonSettings = settings || {};
		
		var sealExtraSettings = function(extraSettings){
			var extraSettingsString = "";			
			for(var name in extraSettings){
				if(extraSettings.hasOwnProperty(name)){
					extraSettingsString += name + " = '" + extraSettings[name] + "' ";
				}
			}
			extraSettingsString = extraSettingsString.substring(0 , extraSettingsString.length - 1);
			extraSettings = {
				"{extraSettings}" : extraSettingsString
			};
			return extraSettings;
		};
		
		var render = function(userSettings){
			settings = userSettings ? $.extend(true , {} , userSettings) : {};
			settings.extraSettings = settings.extraSettings || {};
			settings.extraSettings.combine(commonSettings , false);
			var innerHtml = "";
			var instanceSettings = {};
			var extraSettings = {};
			var tag = "";
			for(var name in settings){
				if(settings.hasOwnProperty(name)){
					if(name == "tag"){
						tag = settings[name];
						continue;
					}
					if(name == "extraSettings"){
						extraSettings = settings[name];
						continue;
					}
					instanceSettings["{" + name + "}"] = settings[name];
				}
			}
			switch(tag){
				case "line":
					var lineInnerHtml = "<line id = '{id}' x1 = '{x1}' y1 = '{y1}' x2 = '{x2}' y2 = '{y2}' {extraSettings}/>";
					extraSettings = sealExtraSettings(extraSettings);
					lineInnerHtml = lineInnerHtml.format(extraSettings);
					innerHtml = lineInnerHtml.format(instanceSettings);
					break;
				case "polyline":
					var polylineInnerHtml = "<polyline id = '{id}' points = '{points}' {extraSettings}/>";
					extraSettings = sealExtraSettings(extraSettings);
					lineInnerHtml = polylineInnerHtml.format(extraSettings);
					innerHtml = polylineInnerHtml.format(instanceSettings);
					break;
				case "rect":
					var rectInnerHtml = "<rect id = '{id}' x = '{x}' y = '{y}' width = '{width}' height = '{height}' {extraSettings}/>";
					extraSettings = sealExtraSettings(extraSettings);
					rectInnerHtml = rectInnerHtml.format(extraSettings);
					innerHtml = rectInnerHtml.format(instanceSettings);
					break;
				case "polygon":
					var polygonInnerHtml = "<polygon id = '{id}' points = '{points}' {extraSettings}/>";
					extraSettings = sealExtraSettings(extraSettings);
					polygonInnerHtml = polygonInnerHtml.format(extraSettings);
					innerHtml = polygonInnerHtml.format(instanceSettings);
					break;
				case "circle":
					var circleInnerHtml = "<circle id = '{id}' cx = '{cx}px' cy = '{cy}px' r = '{r}px' {extraSettings}/>";
					extraSettings = sealExtraSettings(extraSettings);
					circleInnerHtml = circleInnerHtml.format(extraSettings);
					innerHtml = circleInnerHtml.format(instanceSettings);
					break;
				default:
					return "";
			}
			var svgObj = new SvgObject(innerHtml);
			return svgObj;
		};
		
		this.line = function(id , x1 , y1 , x2 , y2 , extraSettings){
			var settings = {
				"tag" : "line",
				"id" : id,
				"x1" : x1,
				"y1" : y1,
				"x2" : x2,
				"y2" : y2,
				"extraSettings" : extraSettings
			};
			return render(settings);
		};
		
		//生成一组线，这组线将公共用extrasettings。返回一个包含了svgobj的数组。
		this.lines = function(lines , extraSettings){
			var lineObjs = [];
			for(var i = 0 ; i < lines.length ; i++){
				var line = lines[i];
				lineObjs.push(this.line(line[0] , line[1] , line[2] , line[3] , line[4] , extraSettings));
			}
			return lineObjs;
		};
		
		this.polyline = function(id , pointsArray){
			var points = "";
			for(var i = 0 ; i < pointsArray ; i++){
				var point = pointsArray[i];
				points += point.x + "," + point.y + " ";
			}
			points = points.substring(0 , points.length - 1);
			var settings = {
				"tag" : "polyline",
				"id" : id,
				"points" : points
			};
			return render(settings);
		};
		
		this.polylines = function(polylines , extraSettings){
			var polylineObjs = [];
			for(var i = 0 ; i < polylines.length ; i++){
				var polyline = polylines[i];
				polylineObjs.push(this.polyline(polyline[0] , polyline[1] , extraSettings));
			}
			return polylineObjs;
		};
		
		this.rect = function(id , x , y , width , height){
			var settings = {
				"tag" : "rect",
				"id" : id,
				"x" : x,
				"y" : y,
				"width" : width,
				"height" : height				
			};
			return render(settings);
		};
		
		this.rects = function(rects , extraSettings){
			var rectObjs = [];
			for(var i = 0 ; i < rects.length ; i++){
				var rect = rects[i];
				rectObjs.push(this.line(rect[0] , rect[1] , rect[2] , rect[3] , rect[4] , extraSettings));
			}
			return rectObjs;
		};
		
		this.polygon = function(id , pointsArray){
			var points = "";
			for(var i = 0 ; i < pointsArray ; i++){
				var point = pointsArray[i];
				points += point.x + "," + point.y + " ";
			}
			points = points.substring(0 , points.length - 1);
			var settings = {
				"tag" : "polygon",
				"id" : id,
				"points" : points
			};
			return render(settings);
		};
		
		this.polygons = function(polygons , extraSettings){
			var polygonObjs = [];
			for(var i = 0 ; i < polygons.length ; i++){
				var polygon = polygons[i];
				polygonObjs.push(this.polygon(polygon[0] , polygon[1] , extraSettings));
			}
			return polygonObjs;
		};
		
		this.circle = function(id , cx , cy , r , extraSettings){
			var settings = {
				"tag" : "circle",
				"id" : id,
				"cx" : cx,
				"cy" : cy,
				"r" : r,
				"extraSettings" : extraSettings
			};
			return render(settings);
		};
		
		this.circles = function(circles , extraSettings){
			var circleObjs = [];
			for(var i = 0 ; i < circles.length ; i++){
				var circle = circles[i];
				circleObjs.push(this.circle(circle[0] , circle[1] , circle[2] , circle[3] , extraSettings));
			}
			return circleObjs;
		};
		
		var SvgObject = function(svgString){
			var svgHtmlString = svgString;
			var $svgObject = $($("<svg>" + svgHtmlString + "</svg>").children()[0]);
			var svgHtmlObject = $svgObject.get(0);
			var that = this;
			
			this.appendTo = function(parent){
				var $parent = $(parent);
				$parent.append($svgObject);
			};
			
			this.appendChild = function(child){
				svgHtmlObject.appendChild(child);
			};
			
			this.attr = function(attrName , attrValue){
				if(attrValue === undefined)
					return getAttr(attrName);
				else
					return setAttr(attrName , attrValue);
			};
			
			var getAttr = function(attrName){
				return $svgObject.attr(attrName);
			};
			
			var setAttr = function(attrName , attrValue){
				$svgObject.attr(attrName , attrValue);
				return that;
			};
		};
		
		this.append = function(child , parent){
			if(child instanceof Array) 
				appendArray(child , parent);
			else
				appendChild(child , parent);	
			return this;
		};
		
		var appendArray = function(childArray , parent){
			for(var i = 0 ; i < childArray.length ; i++){
				var child = childArray[i];
				appendChild(child , parent);
			}
		};
		
		var appendChild = function(child , parent){
			if(child instanceof SvgObject)
				child.appendTo(parent);	
		};
	};
	
	window.SVGHelper = SVGHelper;
})();