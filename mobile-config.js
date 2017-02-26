// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.ribenshier',
  name: '日本事儿',
  description: '不同视角看日本',
  author: 'Rontech',
  email: 'dev@rontech.co.jp',
  website: 'http://www.ribenshier.com'
});

// app 图标
App.icons({
  //'iphone': 'appicons/icon.png',
  'iphone_2x': 'appicons/icon-60@2x.png',
  'iphone_3x': 'appicons/icon-60@3x.png',
  'ipad' : 'appicons/icon-76.png',
  'ipad_2x' :'appicons/icon-76@2x.png'
  //'ipad_pro' : 'appicons/ipad_pro_167.png'
});

App.launchScreens({
	'iphone_2x': 'launchScreen/Default@2x.png',
	'iphone5': 'launchScreen/Default-568h@2x.png',
	'iphone6': 'launchScreen/Default-667h@2x.png',
	'iphone6p_portrait': 'launchscreen/Default-Portrait-736h@3x.png',
  'iphone6p_landscape': 'launchscreen/Default-Landscape-736h@3x.png',
  'ipad_portrait': 'launchscreen/Default-Portrait.png',
  'ipad_portrait_2x': 'launchscreen/Default-Portrait@2x.png',
  'ipad_landscape': 'launchscreen/Default-Landscape.png',
  'ipad_landscape_2x': 'launchscreen/Default-Landscape@2x.png'
});

// 服务器
App.accessRule('http://www.ribenshier.com/*');

// 添加包方法：meteor add cordova:cordova-plugin-wechat@https://github.com/xu-li/cordova-plugin-wechat/tarball/bba096914ef1b5b97d0902affa600aa91232e2a5
App.configurePlugin('cordova-plugin-wechat', {
	WECHATAPPID: "wxdd15b6922237eac5"
});
