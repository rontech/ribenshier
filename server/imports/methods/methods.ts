import { Meteor } from 'meteor/meteor';
import { Topics } from "../../../both/collections/topics.collection";
import { Comments } from "../../../both/collections/comments.collection";
import { Thumbs, Images } from "../../../both/collections/images.collection";
import { TopicThumbeds } from "../../../both/collections/topic-thumbed.collection";
import { check, Match } from 'meteor/check';
import { Profile } from '../../../both/models/profile.model';
import { Activities } from "../../../both/collections/activities.collection";
import { ActivityMembers } from "../../../both/collections/activity-members.collection";
import { ActivityComments } from "../../../both/collections/activity-comments.collection";

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});
 
Meteor.methods({
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(profile.name,  nonEmptyString);
 
    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },
  addTopic(receiverId: string,
           title: string,
           content: string,
           pictureId: string,
           picture: string,
           thumbId: string,
           thumb: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(receiverId, nonEmptyString);
    check(title, nonEmptyString);
    check(content, nonEmptyString);
 
    if (receiverId !== this.userId) throw new Meteor.Error('illegal-receiver',
      '你需要登录才可以操作。');
    
    let dt = new Date();
    const topic = {
      title: title,
      content: content,
      creatorId: receiverId, 
      pictureId: pictureId,
      picture: picture,
      thumbId: thumbId,
      thumb: thumb ? thumb: 'assets/108x80.png',
      commented: 0,
      thumbed: 0, 
      createdAt: dt, 
      sortedBy: dt
    };
 
    Topics.insert(topic);
  },
  removeTopic(topicId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(topicId, nonEmptyString);
 
    let topic = Topics.collection.findOne(topicId);
 
    if (!topic) throw new Meteor.Error('topic-not-exists',
      '对象主题不存在。');

    if(topic.thumbId) Thumbs.remove({_id: topic.thumbId});
    if(topic.pictureId) Images.remove({_id: topic.pictureId});
    TopicThumbeds.remove({topicId}); 
    Comments.remove({topicId});
    Topics.remove(topicId);
  },
  addComment(topicId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(topicId, nonEmptyString);
    check(content, nonEmptyString);

    const topic = Topics.collection.findOne(topicId);
 
    if (!topic) throw new Meteor.Error('topic-not-exists',
      '对象主题不存在。');
 
    let dt = new Date();
    Comments.collection.insert({
      topicId: topicId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Topics.update(topicId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });
  },
  thumbUp(topicId: string, senderId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(senderId, nonEmptyString);
    check(topicId, nonEmptyString);
    
    const thumbed = TopicThumbeds.findOne({topicId: topicId, senderId: senderId});
    if (thumbed) throw new Meteor.Error('already-thumbed',
      '你已经点过赞了！');

    //Thumbed increment
    Topics.update(topicId, {
      $inc: {thumbed: 1} 
    });

    //insert thumbed information
    const thumbedInfo = {
      topicId: topicId,
      senderId: senderId
    };
    TopicThumbeds.insert(thumbedInfo);
  },
  addActivity(title: string,
           people: number,
           day: Date,
           deadline: Date,
           description: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(title, nonEmptyString);
    check(description, nonEmptyString);
 
    let dt = new Date();
    const activity = {
      title: title,
      people: people,
      day: day,
      status: '0',
      deadline: deadline,
      description: description,
      creatorId: this.userId, 
      commented: 0,
      joined: 0, 
      createdAt: dt, 
      sortedBy: dt
    };
 
    Activities.insert(activity);
  },
  removeActivity(activityId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(activityId, nonEmptyString);
 
    let activity = Activities.collection.findOne(activityId);
 
    if (!activity) throw new Meteor.Error('activity-not-exists',
      '删除对象不存在。');

    //ActivityMembers.remove({activityId}); 
    //ActivityComments.remove({activityId});
    Activities.remove(activityId);
  },
  joinActivity(activityId: string, senderId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(senderId, nonEmptyString);
    check(activityId, nonEmptyString);
    
    const member = ActivityMembers.findOne({activityId: activityId, senderId: senderId});
    if (member) throw new Meteor.Error('already-joined',
      '你已经报过名了！');

    //Thumbed increment
    Activities.update(activityId, {
      $inc: {joined: 1} 
    });

    //insert member information
    const memberInfo = {
      activityId: activityId,
      senderId: senderId
    };
    ActivityMembers.insert(memberInfo);
  },
  addActivityComment(activityId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(activityId, nonEmptyString);
    check(content, nonEmptyString);

    const activity = Activities.collection.findOne(activityId);
 
    if (!activity) throw new Meteor.Error('activity-not-exists',
      '对象主题不存在。');
 
    let dt = new Date();
    ActivityComments.collection.insert({
      activityId: activityId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Activities.update(activityId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });
  },
});
