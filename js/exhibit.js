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
  console.log(card.children[2].textContent)
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // 更新打开的页面的内容
  openContentText.innerHTML = '<h1 style="color:black">'+card.children[2].textContent+'</h1>'+paragraphText[card.children[2].textContent];
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




var paragraphText ={'Tears in the rain (雨中的泪)':'<p style="color:black;font-size:20px;">在安戈诺著名的节日“希根特节”期间，我被一个场景深深吸引：有个孩子紧紧抓着他的父亲，而孩子的四周则是庆祝活动造成的混乱。水溅得到处都是，在这个特殊的场景中，可以看到大量的水洒向人群。我非常荣幸成为今年单张照片组别奖的获得者。这张照片对我来说非常特别，因为我将自己与孩子以及她对父母的明显依附姿态联系起来。在照片中，她抓住的似乎是她的父亲。溅落在空中的水造成混乱，为拼命抓住她所能及的孩子带来平衡。生活中，混乱始终存在于我们身边，我们必须找到值得抓住的东西，就像我的这张作品一样。我要再次感谢尼康信任我的作品并评选其获奖。能够参加这次大赛实在是一种荣幸。</p>'
,'Margaret Gallagher is real':'<p style="color:black;font-size:20px;">在一个推测的时间线上，气候危机被迫达到临界点，引发了一场改变人类世界观的行星反应， Margaret Gallagher一辈子过着“脱离网络”的生活。当我们看到一幅有可能拯救我们逃离世界末日的蓝图时，她谈到了互联网和日益恶化的天气。我很荣幸凭借一部作品获得了超短视频的奖项。我有幸见到这位既美丽又诚实的了不起的人，并将其捕捉进视频。我的作品将让世界各地更多的人在40秒的时间里见证这一点。谢谢你， Margaret。</p>'
,'Radiance（辐射）':'<p style="color:black;font-size:20px;">因为感染了新型冠状病毒，这位老人住进了伊朗阿瓦士的 Razi 医院接受治疗。新型冠状病毒于2019年12月在被确认传染给了人类，随后不久便传进了伊朗。在伊朗，疫情高峰期每天约有 350人死亡。该病毒在社会交往、工作、大学和学校等各个方面都造成了严重影响。我很高兴参加了这个已经成功入选 22 名决赛选手的竞赛，并在其中获奖。</p>'
,'Flowers of Fukushima':'<p style="color:black;font-size:20px;">非常感谢能够得到这个奖项。我拍摄福岛的花朵已有四年时间了。我每天都会拍摄一些照片，因为我想让尽可能多的人能够感受到花朵给我们带来的欢乐，这种快乐超越了语言、国家、文化和观念。让人们了解到福岛是一块盛开着美丽鲜花的土地，以及我们继续为我们的家乡感到自豪，这让我非常快乐。拿起相机时，我的脑海中就会浮现出两个愿望：一个是让这座城市变得更加生气勃勃，一个是用花朵鼓起大家的勇气。东日本大地震和随后的核事故对我们平静的生活造成了很大影响，作为福岛的一个居民，我的未来充满着不确定性。不过，即使在这种情况下，山野间的植物依然像往常一样长出嫩芽，给我们带来了生的希望。即使在如此乱成一团的春天，受损的土壤也一如既往地孕育出花蕾，给我一种深深的悲悯之情和难以用言语描述的宁静力量。从那时起，拍摄和展示“福岛之花”就成为我一生的工作。当我向人们展示我拍摄的花朵照片时，他们就会开始讲述自己儿时的记忆，兴奋地告诉我一些他们养花的故事，或者讲述已故亲人的一些往事。此时，与花朵相比，我的存在是微不足道的，甚至我感觉自己好像变成了一只在花间飞舞的小虫子。刚开始的时候，我专注于拍摄花朵是为了暂时忘记地震带来的严酷现实。不过，在某个时候我开始发现自己在拍摄花朵时心情变得非常平和。慢慢地，我与邻居们建立起一种亲密的联系，他们会送我一些花朵，我现在觉得非常开心，而这种开心充满了以花朵为生活重心的每个人的日常生活。"</p>'
,'As Above (如上)':'<p style="color:black;font-size:20px;">Kemi Anna执导的“如上”是一封写给黑人文化的情书，歌颂黑人的爱、黑人的美和黑人的荣耀。这部电影以一种反映现实生活的方式捕捉了家庭、朋友和情侣之间的真实关系。赢得这个奖项令我感到无比兴奋。如果没有才华横溢的工作人员和演员，我不可能做到这一点。非常感谢尼康摄影大赛中选择了“As Above”的所有人。</p>'
,'The last portrait!':'<p style="color:black;font-size:20px;">大不里士的Vadi Rahmat公墓（65号和57号区划）里，母亲、父亲、丈夫、妻子和孩子长眠于此。他们是埋葬在这些区划里的疫情的受害者。根据伊朗的文化和习俗，逝者的肖像被刻在墓碑上。这是他们的最后一幅肖像……。感谢尼康摄影大赛主办方和评委选择了我的摄影作品，本次获奖对我来说是一件非常荣幸的事情。在新冠疫情时代，我们失去了许多亲人。在我的家族中，我的两位阿姨因新冠肺炎，相隔6个月相继去世。去年，我的最后一位阿姨也死于新冠肺炎引起的并发症。当我看到尼康摄影大赛的主题“珍视之物”时，我就想到用我的照片作品“最后一幅肖像！”来参赛。以此纪念我们在这个黑暗时期失去的所有亲人。</p>'
,'The Ocean Voice':'<p style="color:black;font-size:20px;">海洋之声是海洋传递给人类的讯息！ 我们必须学会与海洋建立联系，因为地球上的所有生命都来自海洋！但是人类却仍然将海洋及其生物视为与己无关的问题。 我们必须重新联系，我们必须学习更多知识，我们必须更加热爱海洋！2021年是人类的一个新纪元。 我们刚刚从我们生活中一个非常困难的时刻崛起。我们在缺乏社会联系的那段时间里，把我们的感觉转向了自己，转向了真正重要的东西。 我真的希望，从现在开始，我们人类能够以应有的眼光看待海洋，把它看作是这个星球上每一个生物的繁衍地，并且尊重和保护它。 海洋之声》是海洋写给人类的一封情书。请聆听它…</p>'
,'Ice fishing people':'<p style="color:black;font-size:20px;">冰钓节上的人们，每个人都在冰洞旁占据一席之地，等待鱼儿上钩。非常意外,非常感谢获得大奖,感谢尼康和评委。我对旅行和人们的生活感兴趣,我喜欢将它们载入我的照片中。在这幅作品中,尽管恰逢寒冷的冬天,家家户户以及渔民仍汇聚于冰钓节。我试图拍下那些喜欢冬天的人。</p>'
,'運命回避':'<p style="color:black;font-size:20px;">这是一部反映女权、种族和国籍的问题，同时旨在摆脱来自社会的各种压迫的作品。在新型冠状病毒疫情中，我们的生活被迫发生了巨大的变化。曾经的常态不再是常态，坚定稳固的东西也开始动摇。建立至今的这一庞大体系已经改变，逃离也许就有望实现解放，出于这一想法，我制作了该短片。这是一个由我们三个人制作的视频，但我们很高兴它被选中。 我们觉得这是表达自己的正确时机，因为我们感到被科罗娜的流行病所阻挡。 不仅是我们，我想很多人都有同样的感觉。 我们希望这部影片能传播给尽可能多的人，并帮助他们摆脱自身的压迫。   </p>'
,'Secret Artist':'<p style="color:black;font-size:20px;">有一句谚语“真正的艺术家永远不会停止创作艺术”，这句话最适合于巴斯卡。现在他正在做送餐员。巴斯卡从不以其地位评判一项工作，而是始终相信努力和奉献精神。除了他的工作，他喜欢写一些关于社会时事的诗，他也可以画出一些非凡的画作。几乎没有人能够了解他的艺术身份，因为他从未向世界展示过。作为一名摄影师,我总是会搜索一些社会信息,这些信息可以通过我的摄影视觉语言传达给观众。我很感激巴斯卡尔（Baskar）,他允许我记录他的日常生活方式,在那里我发现了他隐藏的天赋。我很感谢尼康让我有机会在世界面前展示巴斯卡尔的故事,我希望其他像巴斯卡尔一样的人可以通过这种全球展示切实地获得鼓励。非常感谢评委们将我的照片选为优胜作品。</p>'
,'芳华':'<p style="color:black;font-size:20px;">如眼睛一般，时常挂在胸前的相机成为我身体的一部分，使我与同龄人相处时并没有因为它的存在而产生距离，每张照片之中所发生的，自己也都是其中的参与者，我将镜头对准他们，等同于在我的生活中进行截图。每一颗雨滴，每一个微笑，每一次奔跑和一片片水花，虽然是再普通不过的事物，但都见证着那包括我自己在内的熠熠生辉的青春，我不断拍摄下去，希望为自己所处的芳华留下回忆。不停的拍摄，直到生命停止。</p>'
,'Unique Love':'<p style="color:black;font-size:20px;">我在垃圾火灾项目中拍摄了这个场景。我正巧看到了这个场景，心里感到非常难过和痛苦。起先，我猜想这只母狗正在为她的小宝宝做正常的母乳喂养。但是当我仔细看她时，发现她已经因伤死亡了。即使受伤的情况下，她也至死都在照顾她的孩子。她是一个动物，但这一幕表明母爱是多么伟大！对她孩子的未来而言，这也是一个残酷的变故。我是一名以缅甸为主要基地的旅游摄影师。如果尼康公司提供机会,我的目标是成为尼康大使。我真的很荣幸第二次成为尼康摄影大赛的获奖者之一。我要感谢尼康摄影大赛和所有在选择获奖者方面辛苦工作的评委。这张照片是偶然拍摄的,但它令我感到震撼。它展示了强烈的母爱,以及最终对幼犬的未来而言残酷变故的一刻。我相信没有其他的爱可以与母亲对孩子或婴儿的无条件的爱相比。这是予以世界上每个人真正的美丽礼物。</p>'}

//var paragraphText = '<p style="color:black;font-size:20px;">Somebody once told me the world is gonna roll me. I ain\'t the sharpest tool in the shed. She was looking kind of dumb with her finger and her thumb in the shape of an "L" on her forehead. Well the years start coming and they don\'t stop coming. Fed to the rules and I hit the ground running. Didn\'t make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see. So what\'s wrong with taking the back streets? You\'ll never know if you don\'t go. You\'ll never shine if you don\'t glow.</p><p>Hey now, you\'re an all-star, get your game on, go play. Hey now, you\'re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</p><p>It\'s a cool place and they say it gets colder. You\'re bundled up now, wait till you get older. But the meteor men beg to differ. Judging by the hole in the satellite picture. The ice we skate is getting pretty thin. The water\'s getting warm so you might as well swim. My world\'s on fire, how about yours? That\'s the way I like it and I never get bored.</p>';