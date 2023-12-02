// 在此处列出 VAR，以便它们处于全局范围内
var cards, nCards, cover, openContent, openContentText, pageIsOpen = false,
    openContentImage, closeContent, windowWidth, windowHeight, currentCard;


init();

function init() {
  resize();
  selectElements();
  attachListeners();
}

// 选择将要使用的DOM中的所有元素。
function selectElements() {
  cards = document.getElementsByClassName('card'),
  nCards = cards.length,
  cover = document.getElementById('cover'),
  openContent = document.getElementById('open-content'),
  openContentText = document.getElementById('open-content-text'),
  openContentImage = document.getElementById('open-content-image')
  closeContent = document.getElementById('close-content');
}

/* 
在这里附加了三个事件监听器：

为每个卡片附加了一个点击事件监听器
为关闭按钮附加了一个点击事件监听器
为窗口附加了一个调整大小事件监听器
*/
function attachListeners() {
  for (var i = 0; i < nCards; i++) {
    attachListenerToCard(i);
  }
  closeContent.addEventListener('click', onCloseClick);
  window.addEventListener('resize', resize);
}

function attachListenerToCard(i) {
  cards[i].addEventListener('click', function(e) {
    var card = getCardElement(e.target);
    onCardClick(card, i);
  })
}

/* When a card is clicked */
function onCardClick(card, i) {
  currentCard = card;
  // 将“clicked”类添加到卡片中，使其以动画形式显示出来
  currentCard.className += ' clicked';
  // 在 500 毫秒延迟后对卡片“盖板”进行动画处理
  setTimeout(function() {animateCoverUp(currentCard)}, 500);
  // 为其他卡片添加动画效果
  animateOtherCards(currentCard, true);
  // 将 Open 类添加到页面内容
  openContent.className += ' open';
}

/*
这种效果是通过创建一个单独的'cover' div，将其放置在与点击的卡片相同的位置，
并将其动画显示为打开“页面”的背景而产生的。看起来就像是卡片本身在动画进入背景，
但以这种方式实现更加高效（因为cover div是绝对定位的，没有子元素），
而且在处理卡片中的z-index和其他元素时更加简洁。
*/
function animateCoverUp(card) {
  // 获取点击卡片的位置
  var cardPosition = card.getBoundingClientRect();
  // 获取单击卡片的样式
  var cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition);
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // 更新打开的页面的内容
  openContentText.innerHTML = '<h1 style="color:black">'+card.children[2].textContent+'</h1>'+paragraphText;
  openContentImage.src = card.children[1].src;
  setTimeout(function() {
    // 将滚动位置更新为 0（使其位于“打开”页面的顶部）
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);
}

function animateCoverBack(card) {
  var cardPosition = card.getBoundingClientRect();
  // 由于滚动，原始卡可能处于不同的位置，因此在缩小之前需要重置盖板位置
  setCoverPosition(cardPosition);
  scaleCoverToFillWindow(cardPosition);
  // 以动画方式缩放到卡片大小和位置
  cover.style.transform = 'scaleX('+1+') scaleY('+1+') translate3d('+(0)+'px, '+(0)+'px, 0px)';
  setTimeout(function() {
    // 将内容设置回空
    openContentText.innerHTML = '';
    openContentImage.src = '';
    // 将封面设计成0x0，使其隐藏起来
    cover.style.width = '0px';
    cover.style.height = '0px';
    pageIsOpen = false;
    // 删除单击的类，以便卡片重新进行动画处理
    currentCard.className = currentCard.className.replace(' clicked', '');
  }, 301);
}

function setCoverPosition(cardPosition) {
  // 设计封面样式，使其与卡片处于完全相同的位置
  cover.style.left = cardPosition.left + 'px';
  cover.style.top = cardPosition.top + 'px';
  cover.style.width = cardPosition.width + 'px';
  cover.style.height = cardPosition.height + 'px';
}

function setCoverColor(cardStyle) {
  // 将封面设置为与卡片颜色相同的样式
  cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
  // 计算卡片填满页面的比例和位置，
  var scaleX = windowWidth / cardPosition.width;
  var scaleY = windowHeight / cardPosition.height;
  var offsetX = (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  var offsetY = (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // 在封面上设置转换 - 由于在 CSS 中设置了过渡，它将动画化
  cover.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+') translate3d('+(offsetX)+'px, '+(offsetY)+'px, 0px)';
}

/* When the close is clicked */
function onCloseClick() {
  // 删除 Open 类，以便页面内容以动画形式显示
  openContent.className = openContent.className.replace(' open', '');
  // 将封面动画恢复为原始位置卡和大小
  animateCoverBack(currentCard);
  // 在其他卡片中制作动画
  animateOtherCards(currentCard, false);
}

function animateOtherCards(card, out) {
  var delay = 100;
  for (var i = 0; i < nCards; i++) {
    // 交错制作卡片动画，每 100 毫秒 1 张
    if (cards[i] === card) continue;
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
}

// 单个卡片上的动画（通过添加/删除卡片名称）
function animateOutCard(card, delay) {
  setTimeout(function() {
    card.className += ' out';
   }, delay);
}

function animateInCard(card, delay) {
  setTimeout(function() {
    card.className = card.className.replace(' out', '');
  }, delay);
}

// 此函数向上搜索 DOM 树，直到到达已单击的 card 元素
function getCardElement(el) {

  try {
      if (el.className.indexOf('card ') > -1) return el;
      else return getCardElement(el.parentElement);
  } catch (error) {
      
}

}

//resize 函数 - 记录窗口宽度和高度
function resize() {
  if (pageIsOpen) {
    // update position of cover
    var cardPosition = currentCard.getBoundingClientRect();
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
  }
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}


var paragraphText = '<p style="color:black">Somebody once told me the world is gonna roll me. I ain\'t the sharpest tool in the shed. She was looking kind of dumb with her finger and her thumb in the shape of an "L" on her forehead. Well the years start coming and they don\'t stop coming. Fed to the rules and I hit the ground running. Didn\'t make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see. So what\'s wrong with taking the back streets? You\'ll never know if you don\'t go. You\'ll never shine if you don\'t glow.</p><p>Hey now, you\'re an all-star, get your game on, go play. Hey now, you\'re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</p><p>It\'s a cool place and they say it gets colder. You\'re bundled up now, wait till you get older. But the meteor men beg to differ. Judging by the hole in the satellite picture. The ice we skate is getting pretty thin. The water\'s getting warm so you might as well swim. My world\'s on fire, how about yours? That\'s the way I like it and I never get bored.</p>';