(function(){
	var SMILAnimationHelper = function(settings){
		var date = new Date();
		var commonSettings = settings || {};
		var startMillSecond = date.getTime(); 
		
		var generatorBeginSecond = function(){
			var nowDate = new Date();
			var nowMillSecond = nowDate.getTime();
			return parseFloat((nowMillSecond - startMillSecond) / 1000);
		}
		
		var generateAnimationID = function(){
			var nowDate = new Date();
			var nowMillSecond = nowDate.getTime();
			var nowMillSecondString = nowMillSecond.toString();
			var animationID = nowMillSecondString.md5();
			return animationID;
		};
		
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
			var settings = userSettings ? $.extend(true , {} , userSettings) : {};
			settings.extraSettings = settings.extraSettings || {};
			settings.extraSettings.combine(commonSettings , false);
			var tag = "";
			var action = "";
			var innerHtml = "";
			var instanceSettings = {}; //只针对这次渲染的设置。
			var extraSettings = {};
			for(var name in settings){
				if(settings.hasOwnProperty(name)){
					if(name == "tag"){
						tag = settings[name];
						continue;
					}
					if(name == "action"){
						action = settings[name];
						continue;
					}
					if(name === "extraSettings"){
						extraSettings = settings[name];
						continue;
					}
					instanceSettings["{" + name + "}"] = settings[name];
				}
			}
			switch(tag){
				case "set":
					var setInnerHtml = "<set begin = '{begin}' dur = '{dur}' to = '{to}' attributeName = '{attributeName}' {extraSettings}/>";
					extraSettings = sealExtraSettings(extraSettings);
					setInnerHtml = setInnerHtml.format(extraSettings);
					setInnerHtml = setInnerHtml.format(instanceSettings);
					innerHtml = setInnerHtml;
					break;
				case "animate":
					var animateInnerHtml = "<animate attributeName = '{attributeName}' from = '{from}' to = '{to}' begin = '{begin}' dur = '{dur}' repeatCount = '{repeatCount}' {extraSettings}/>"
					extraSettings = sealExtraSettings(extraSettings);
					animateInnerHtml = animateInnerHtml.format(extraSettings);
					animateInnerHtml = animateInnerHtml.format(instanceSettings);
					innerHtml = animateInnerHtml;
					break;
				case "animateTransform":
					var actionSetting = {};
					var actionInnerHtml = "";
					switch(action){
						case "scale":
							actionInnerHtml = "type = 'scale' from = '{from}' to = '{to}'";
							actionInnerHtml = actionInnerHtml.format(instanceSettings);
							actionSetting = {
								"{action}": actionInnerHtml
							};
							break;
						case "translate":
							actionInnerHtml = "type = 'translate' from = '{fromX} {fromY}' to = '{toX} {toY}'";
							actionInnerHtml = actionInnerHtml.format(instanceSettings);
							actionSetting = {
								"{action}": actionInnerHtml
							};
							break;
						case "rotate":
							actionInnerHtml = "type = 'rotate' from = '{fromAngle} {fromX} {fromY}' to = '{toAngle} {toX} {toY}'";
							actionInnerHtml = actionInnerHtml.format(instanceSettings);
							actionSetting = {
								"{action}": actionInnerHtml
							};
							break;
						default:
							return "";
					}
					var animateTransformHtml = "<animateTransform attributeName = '{attributeName}' begin = '{begin}' dur = '{dur}' repeatCount = '{repeatCount}' {action} {extraSettings}/>"
					animateTransformHtml = animateTransformHtml.format(actionSetting);
					extraSettings = sealExtraSettings(extraSettings);
					animateTransformHtml = animateTransformHtml.format(extraSettings);
					animateTransformHtml = animateTransformHtml.format(instanceSettings);
					innerHtml = animateTransformHtml;
					break;
				default:
					return "";
			}
			return innerHtml;
		};
		
		this.animate = function(attributeName , from , to , dur , repeatCount , extraSettings){
			var settings = {
				"tag" : "animate",
				"attributeName" : attributeName,
				"from" : from,
				"to" : to,
				"dur" : dur,
				"repeatCount" : repeatCount,
				"extraSettings" : extraSettings
			};
			
			var animationHtml = render(settings);
			var animationObject = new AnimationObject(animationHtml , dur);
			return animationObject;
		};
		
		this.rotate = function(fromAngle , fromX , fromY , toAngle , toX , toY, dur, repeatCount , extraSettings){
			var settings = {
				"tag" : "animateTransform",
				"action" : "rotate",
				"attributeName" : "transform",
				"dur" : dur,
				"repeatCount" : repeatCount,
				"fromAngle" : fromAngle,
				"fromX" : fromX,
				"fromY" : fromY,
				"toAngle" : toAngle,
				"toX" : toX,
				"toY" : toY,
				"extraSettings" : extraSettings
			};
			var animationHtml = render(settings);
			var animationObject = new AnimationObject(animationHtml , dur);
			return animationObject;
		};
		
		this.translate = function(fromX , fromY , toX , toY , dur , repeatCount , extraSettings){
			var settings = {
				"tag" : "animateTransform",
				"action" : "translate",
				"attributeName" : "transform",
				"dur" : dur,
				"repeatCount" : repeatCount,
				"fromX" : fromX,
				"fromY" : fromY,
				"toX" : toX,
				"toY" : toY,
				"extraSettings" : extraSettings
			};
			var animationHtml = render(settings);
			var animationObject = new AnimationObject(animationHtml , dur);
			return animationObject;
		};
		
		this.scale = function(from , to , dur , repeatCount , extraSettings){
			var settings = {
				"tag" : "animateTransform",
				"action" : "scale",
				"attributeName" : "transform",
				"dur" : dur,
				"repeatCount" : repeatCount,
				"from" : from,
				"to" : to,
				"extraSettings" : extraSettings
			};
			var animationHtml = render(settings);
			var animationObject = new AnimationObject(animationHtml , dur);
			return animationObject;
		};
		
		var AnimationObject = function(html , d){
			var dur = d * 1000; //把秒转成毫秒。
			var addedTime = 50;
			var finishCallback = undefined;
			var finishAnimationObject = undefined;
			var finishAnimationElement = undefined;
			var animationOver = false;
			var animationHtml = html;
		
			this.start = function(animationElement){
				var setting = {
					"{begin}" : generatorBeginSecond()
				};
				animationHtml = animationHtml.format(setting);
				var animationObject = $("<svg>" + animationHtml + "</svg>").children()[0];
				animationElement.appendChild(animationObject);
				
				setTimeout(function(){
					animationOver = true;
					if(finishCallback) finishCallback();
					if(finishAnimationObject && finishAnimationElement) finishAnimationObject.start(finishAnimationElement);
				} , dur + addedTime);
				
				return this; //方便链式操作。
			};
			
			this.delay = function(animationElement , delay){
				var delayTime = delay * 1000;
				var that = this;
				setTimeout(function(){
					that.start(animationElement);
				} , delayTime);
			};
			
			this.finish = function(animationObj , animationElement){
				if(typeof(animationObj) === "function"){
					var callback = animationObj;
					if(animationOver) callback();
					else finishCallback = callback;
				}else if(animationObj instanceof AnimationObject && animationElement != null){
					if(animationOver) animationObj.start(animationElement);
					else{
						finishAnimationObject = animationObj;
						finishAnimationElement = animationElement;
					}
					return animationObj;
				}
				return this;
			};
		}; 
	};
	window.SMILAnimationHelper = SMILAnimationHelper;
})();