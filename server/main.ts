import { Main } from './imports/server-main/main';
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';
import './imports/methods/methods';
import './imports/publications/topics.publication';
import './imports/publications/comments.publication';
import './imports/publications/users.publication';
import './imports/publications/images.publication';
import './imports/publications/activities.publication';
import './imports/publications/activity-members.publication';
import './imports/publications/activity-comments.publication';
import './imports/publications/houses.publication';
import './imports/publications/house-comments.publication';
import './imports/publications/house-pictures.publication';
import './imports/publications/jobs.publication';
import './imports/publications/job-comments.publication';
import './imports/publications/bookmarks.publication';
import './imports/publications/notifications.publication';
import './imports/publications/house-second-comments.publication';
import './imports/publications/job-second-comments.publication';
import './imports/publications/activity-second-comments.publication';
import './imports/publications/apper-comments.publication';

const mainInstance = new Main();
mainInstance.start();
Meteor.startup(() => {
  let smtp = {
    //username: 'ribenshier@gmail.com',
    username: 'ribenshier@rontech.co.jp',
    password: '!Qaz@Wsx*Ik,(Ol.',
    server:   'smtp.gmail.com',
    port: 465
  }

  process.env['MAIL_URL'] =  'smtps://'
    + encodeURIComponent(smtp.username) + ':'
    + smtp.password + '@'
    + smtp.server + ':' + smtp.port;

  Accounts.emailTemplates.siteName = '日本事儿';
  Accounts.emailTemplates.from = '日本事儿<no-reply@ribenshier.com>';

  Accounts.emailTemplates.resetPassword.subject = (user) => {
    return '重置您的密码';
  };

  Accounts.emailTemplates.resetPassword.text = (user, url) => {
    return '尊敬的用户' + user.profile.name + ' 您好,\n\n' +
        '请点击下面的链接来重置您的密码:\n' +
        url.replace('reset-password', 'reset-page') + '\n\n' +
        '请务必记住您的密码!!!\n\n\n' +
        '日本事儿网站服务\n' 
  };
});

