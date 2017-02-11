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
  // 'iphone': 'appicons/iphone.png',
  'iphone_2x': 'appicons/iphone_2x_120.png',
  'iphone_3x': 'appicons/iphone_3x_180.png',
  'ipad' : 'appicons/ipad_76.png',
  'ipad_2x' :'appicons/ipad_2x_152.png',
  'ipad_pro' : 'appicons/ipad_pro_167.png'
});

App.launchScreens({
	'iphone_2x': 'launchScreen/iphone2x_640X960.png',
	'iphone5': 'launchScreen/iphone5_640X1136.png',
	'iphone6': 'launchScreen/iphone6_750X1334.png',
	'iphone6p_portrait': 'launchscreen/iphone6s_1204X2208.png'
});

// 服务器
App.accessRule('http://www.ribenshier.com/*');

//wechat config 
// 使用插件：boxfish:accounts-wechat
// 插件地址：https://github.com/boxfish/meteor-accounts-wechat
App.configurePlugin('cordova-plugin-wechat', {
    WECHATAPPID: 'wxdd15b6922237eac5'
});

// // 添加包方法：meteor add cordova:xu.li.cordova.wechat@https://github.com/xu-li/cordova-plugin-wechat/tarball/ab08d76f322f7988e34231b3655300d3f36b37fa
App.configurePlugin('cordova-plugin-wechat', {
	WECHATAPPID: "wxdd15b6922237eac5"
});
