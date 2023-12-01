// var exchangeInfmation = 0;
// function changeBody(){
// 	var bodyGroundColor = document.body;
// 	var defultGroundCol = "rgb(255, 255, 224)",
// 		defultFontCol = "rgb(0, 0, 0)",
// 		nightGroundCol = "#2F4F4F",
// 		nightFontCol = "white",
// 		nowGroundCol = bodyGroundColor.style.backgroundColor,
// 		nowFontCol = bodyGroundColor.style.color;
// 	// console.log('font',nowFontCol,'ground',nowGroundCol)
// 	if (nowGroundCol == defultGroundCol){bodyGroundColor.style.backgroundColor = nightGroundCol}
// 	else{bodyGroundColor.style.backgroundColor = defultGroundCol}
// 	if(nowFontCol == defultFontCol){bodyGroundColor.style.color = nightFontCol}
// 	else{bodyGroundColor.style.color = defultFontCol}
// }

function changeBody() {
    var bodyGroundColor = document.body;
    var defultGroundCol = "rgb(255, 255, 224)";
    var defultFontCol = "rgb(0, 0, 0)";
    var nightGroundCol = "#2F4F4F";
    var nightFontCol = "white";
    var nowGroundCol = bodyGroundColor.style.backgroundColor;
    var nowFontCol = bodyGroundColor.style.color;

    bodyGroundColor.style.transition = "background-color 0.5s ease, color 0.5s ease"; // 添加颜色渐变的过渡效果

    if (nowGroundCol === defultGroundCol) {
        bodyGroundColor.style.backgroundColor = nightGroundCol;
    } else {
        bodyGroundColor.style.backgroundColor = defultGroundCol;
    }

    if(nowFontCol === defultFontCol){
        bodyGroundColor.style.color = nightFontCol;
    } else {
        bodyGroundColor.style.color = defultFontCol;
    }
}


function changeColor(){
	// 获取按钮长度
	var buttonWidth = parseInt(document.getElementById("modeButton").offsetWidth);
	// 颜色渐变
	var defultBackgroundCol = "rgb(102, 204, 255)",
		defultCol = "rgb(255, 215, 0)",
		nightBackgroundCol = "#436EEE",
		nightCol = "#828282";
	var backgroundElement = document.getElementById("modeButton");
	var buttonElement = document.getElementById("light");
	// console.log(buttonElement.style.backgroundColor,defultBackgroundCol);
	if (backgroundElement.style.backgroundColor == defultBackgroundCol) {
	    backgroundElement.style.backgroundColor = nightBackgroundCol;
	} else {
	    backgroundElement.style.backgroundColor = defultBackgroundCol;
	}
	// 圆改色
	if (buttonElement.style.backgroundColor == defultCol) {
	    buttonElement.style.backgroundColor = nightCol;
	} else {
	    buttonElement.style.backgroundColor = defultCol;
	}
	

}
function exchange(){

	// 获取按钮长度
	var buttonWidth = parseInt(document.getElementById("modeButton").offsetWidth);
	var button = document.getElementById("light");
	// alert(buttonWidth);
		// console.log(parseInt(button.style.left)||0,(buttonWidth-2)/2)
	// 需要移动的距离
	var sportPos = (buttonWidth)/2;
	// 刚开始移动为NULL
	var whereButton = parseInt(button.style.left)||0;
	// 判断处于什么模式
	// 移动中
	// console.log(whereButton,buttonWidth,sportPos)
	if (whereButton>0 && whereButton<sportPos){console.log(0)}
	// 黑
	else if (whereButton == sportPos){
		// console.log(2)
		changeColor();
		changeBody();
		var id = setInterval(frame,2);
		var pos = 30;
		function frame(){
			if (pos == 0){
				clearInterval(id);
			}
			else{
				pos--;
				button.style.left = pos + 'px';
			}
		}
	}else{
		// console.log(1)
		changeColor();
		changeBody();
		var id = setInterval(frame,2);
		var pos = 0;
		function frame(){
			if (pos == sportPos){
				// 缺了1px
				button.style.left = pos + 'px';
				clearInterval(id);
			}
			else{
				pos++;
				button.style.left = pos + 'px';
				// console.log('11',pos,sportPos)
			}
		}

	}
}