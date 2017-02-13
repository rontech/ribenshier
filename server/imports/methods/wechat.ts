import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import * as _ from 'underscore';

let wechat_config = {
    appId: 'wx25a4726b89792eda',
    scope: 'basic',
    secret: "7a8d26c1f5de1315486de7fe48d4951d"
};

/////////////////////////
let getToken = function(auth) {
  let resp = HTTP.get(
      "https://api.weixin.qq.com/sns/oauth2/access_token", {
      params: {
        code: auth.code,
        appid: wechat_config.appId,
        secret: wechat_config.secret,
        grant_type: 'authorization_code'
      }
    }
  );

console.log("token response=", resp);
console.log("token response content=", resp.content);
  let content = JSON.parse(resp.content);
  if (content.error) throw content;

  return {
    accessToken: content.access_token,
    expiresIn: content.expires_in,
    refreshToken: content.refresh_token,
    openId: content.openid,
    scope: content.scope,
    unionId: content.unionid
  };
};

/////////////////////////
let getIdentity = function(accessToken, openId) {
  let resp = HTTP.get("https://api.weixin.qq.com/sns/userinfo", {
    params: {access_token: accessToken, openid: openId, lang: 'en'}}
  );

  let content = JSON.parse(resp.content);
  if (content.error) throw content;

  return content;
};

let serviceHandler = function(auth) {
  let whitelistedFields = ['nickname', 'sex', 'province', 'city', 
                          'country', 'headimgurl', 'privilege'];
  let resp = getToken(auth);
  console.log("getToken=", resp);

  let serviceData = {
    accessToken: resp.accessToken,
    expiresAt: (+new Date) + (1000 * parseInt(resp.expiresIn, 10)),
    openId: resp.openId,
    unionId: resp.unionId,
    scope: resp.scope,
    id: resp.unionId  // id is required by Meteor, using openId since it's not given by WeChat
  };

  if (resp.refreshToken)  serviceData['refreshToken'] = resp.refreshToken;

  let identity = getIdentity(resp.accessToken, resp.openId);
  console.log("getIdentity=", identity);
  let fields = _.pick(identity, whitelistedFields);
  _.extend(serviceData, fields);

  return serviceData;
};

Meteor.methods({
  getWechatAccount(auth) {
    try {
      console.log('auth=', auth);
      let data =  serviceHandler(auth);
      console.log('data=', data);
    } catch(e) {
      console.log('catch: ' + e);
    }
  }
});
