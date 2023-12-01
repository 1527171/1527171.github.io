window.addEventListener('scroll', checkVisibilityAndAnimate);
function checkVisibilityAndAnimate() {
	var font = document.getElementByClassName("hidden-text");
	if (isElementInViewport(font)) {
		console.log('目标元素在页面上可见。');
		font.style.animation = "flash-in 1s 1";
		font.style.animationFillMode = "forwards";
	} else {
		console.log('目标元素在页面上不可见。');
		font.style.animation = "flash-out 1s 1";
		font.style.animationFillMode = "forwards";
	}
}

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
  	return (
    	rect.top >= 0 &&
    	rect.left >= 0 &&
    	rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    	rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
