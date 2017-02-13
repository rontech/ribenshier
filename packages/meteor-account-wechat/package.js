Package.describe({
  name: 'rontech:meteor-account-wechat',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'meteor accout login by wechat on mobile and web',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rontech/meteor-account-wechat',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.1');

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'random', 'service-configuration'], ['client', 'server']);
  api.use(['templating'], 'client');

  api.use(['underscore', 'random']);

  api.export('MeteorWechat');
 
  api.addFiles('wechat_server.js','server');
});

Cordova.depends({
  'cordova-plugin-wechat': '1.1.2'
});
