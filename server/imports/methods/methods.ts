import { Meteor } from 'meteor/meteor';
import { Topics } from '../../../both/collections/topics.collection';
import { Comments } from '../../../both/collections/comments.collection';
import { Thumbs, Images } from '../../../both/collections/images.collection';
import { Thumb } from '../../../both/models/image.model';
import { TopicThumbeds } from '../../../both/collections/topic-thumbed.collection';
import { check, Match } from 'meteor/check';
import { Profile } from '../../../both/models/profile.model';
import { Activities } from '../../../both/collections/activities.collection';
import { ActivityMembers } from '../../../both/collections/activity-members.collection';
import { ActivityComments } from '../../../both/collections/activity-comments.collection';
import { House } from '../../../both/models/house.model';
import { Houses } from '../../../both/collections/houses.collection';
import { HouseComments } from '../../../both/collections/house-comments.collection';
import { HousePictures } from '../../../both/collections/house-pictures.collection';
import { Job } from '../../../both/models/job.model';
import { Jobs } from '../../../both/collections/jobs.collection';
import { JobComments } from '../../../both/collections/job-comments.collection';
import { Bookmarks } from '../../../both/collections/bookmarks.collection';
import { Notifications } from '../../../both/collections/notifications.collection';

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
 
    Topics.collection.insert(topic);
  },
  removeTopic(topicId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(topicId, nonEmptyString);
 
    let topic = Topics.collection.findOne(topicId);
 
    if (!topic) throw new Meteor.Error('topic-not-exists',
      '对象主题不存在。');

    if(topic.thumbId) Thumbs.collection.remove({_id: topic.thumbId});
    if(topic.pictureId) Images.collection.remove({_id: topic.pictureId});
    TopicThumbeds.collection.remove({topicId}); 
    Comments.collection.remove({topicId});
    Topics.collection.remove(topicId);
    Bookmarks.collection.remove({objId: topicId});
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
      objId: topicId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Topics.collection.update(topicId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });

    //add a notification to the topic owner
    const creator = Meteor.users.findOne(topic.creatorId);
    if(creator.profile.notify && this.userId != topic.creatorId)
      Notifications.collection.insert({
        objId: topicId,
        objType: 'topic',
        notType: 'c',
        message: topic.title,
        senderId: this.userId,
        toId: topic.creatorId,
        read: false,
        createdAt: dt
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
    Topics.collection.update(topicId, {
      $inc: {thumbed: 1} 
    });

    //insert thumbed information
    const thumbedInfo = {
      topicId: topicId,
      senderId: senderId
    };
    TopicThumbeds.collection.insert(thumbedInfo);

    //add a notification to the topic owner
    const topic = Topics.collection.findOne(topicId);
    const creator = Meteor.users.findOne(topic.creatorId);
    let dt = new Date();
    if(creator.profile.notify && senderId != topic.creatorId)
      Notifications.collection.insert({
        objId: topicId,
        objType: 'topic',
        notType: 't',
        message: topic.title,
        senderId: senderId,
        toId: topic.creatorId,
        read: false,
        createdAt: dt
      });
  },
  addActivity(title: string,
           people: string,
           day: string,
           deadline: string,
           description: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(title, nonEmptyString);
    check(description, nonEmptyString);
 
    let dt = new Date();
    const activity = {
      title: title,
      people: parseInt(people),
      day: new Date(day),
      status: '0',
      deadline: new Date(deadline),
      description: description,
      creatorId: this.userId, 
      commented: 0,
      joined: 0, 
      createdAt: dt, 
      sortedBy: dt
    };
 
    Activities.collection.insert(activity);
  },
  removeActivity(activityId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(activityId, nonEmptyString);
 
    let activity = Activities.collection.findOne(activityId);
 
    if (!activity) throw new Meteor.Error('activity-not-exists',
      '删除对象不存在。');

    ActivityMembers.collection.remove({activityId}); 
    ActivityComments.collection.remove({activityId});
    Activities.collection.remove(activityId);
    Bookmarks.collection.remove({objId: activityId});
  },
  joinActivity(activityId: string, senderId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(senderId, nonEmptyString);
    check(activityId, nonEmptyString);
    
    const activity = Activities.collection.findOne(activityId);

    if(activity.status === '-1') 
      throw new Meteor.Error('stopped', '活动已经中止。');

    if(activity.deadline) {
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if(today.getTime() > activity.deadline.getTime())
        throw new Meteor.Error('outdated', '活动已经过期。');
    }

    const member = ActivityMembers.collection.findOne({activityId: activityId, senderId: senderId});
    if (member)
      throw new Meteor.Error('already-joined', '你已经报过名了！');

    if(activity.status === '1') 
      throw new Meteor.Error('overcrowded', '活动已经满员。');

    if(activity.joined >= activity.people) 
      throw new Meteor.Error('overcrowded', '活动已经满员。');

    let status = '0';
    if(activity.people == activity.joined + 1) status = '1';

    Activities.collection.update(activityId, {
      $inc: {joined: 1}, 
      $set: {status: status}
    });

    //insert member information
    const memberInfo = {
      activityId: activityId,
      senderId: senderId
    };
    ActivityMembers.collection.insert(memberInfo);

    //add a notification to the owner
    let dt = new Date();
    const creator = Meteor.users.findOne(activity.creatorId);
    if(creator.profile.notify && senderId != activity.creatorId)
      Notifications.collection.insert({
        objId: activityId,
        objType: 'activity',
        notType: 'j',
        message: activity.title,
        senderId: senderId,
        toId: activity.creatorId,
        read: false,
        createdAt: dt
      });
  },
  unjoinActivity(activityId: string, senderId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(senderId, nonEmptyString);
    check(activityId, nonEmptyString);
    
    const member = ActivityMembers.collection.findOne({activityId: activityId, senderId: senderId});
    if (!member)
      throw new Meteor.Error('member-not-exists', '你并未报名。');

    Activities.collection.update(activityId, {
      $inc: {joined: -1}, 
      $set: {status: '0'}
    });

    //remove member information
    const memberInfo = {
      activityId: activityId,
      senderId: senderId
    };
    ActivityMembers.collection.remove(memberInfo);

    //add a notification to the owner
    const activity = Activities.collection.findOne(activityId);
    const creator = Meteor.users.findOne(activity.creatorId);
    let dt = new Date();
    if(creator.profile.notify && senderId != activity.creatorId)
      Notifications.collection.insert({
        objId: activityId,
        objType: 'activity',
        notType: 'u',
        message: activity.title,
        senderId: senderId,
        toId: activity.creatorId,
        read: false,
        createdAt: dt
      });
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
      objId: activityId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Activities.collection.update(activityId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });
  },
  cancelActivity(activityId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(activityId, nonEmptyString);
    
    //Thumbed increment
    Activities.collection.update(activityId, {
      $set: {status: '-1'}
    });

    //notify all joined users
    let dt = new Date();
    const activity = Activities.collection.findOne(activityId);
    const members = ActivityMembers.collection.find({activityId: activityId});
    members.forEach(member => {
      Notifications.collection.insert({
        objId: activityId,
        objType: 'activity',
        notType: 's2',
        message: activity.title,
        senderId: this.userId,
        toId: member.senderId,
        read: false,
        createdAt: dt
      });
    });
  },
  addHouse(
         title: string, forRental: boolean, type: string,
         brief: string, floorPlan: string, area: number,
         access: string, price: number,built: number,
         pictureId: string, picture: string, thumbId: string,
         thumb: string, description: string,
         subPictureIdArray: Array<string>, 
         subPictureArray: Array<string>,
         subThumbIdArray: Array<string>, subThumbArray: Array<string>
  ): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(title, nonEmptyString);
 
    let dt = new Date();
    const house = {
      title: title,
      forRental: forRental,
      creatorId: this.userId, 
      type: type,
      brief: brief,
      floorPlan: floorPlan,
      area: area,
      access: access,
      price: price,
      built: built,
      description: description,
      pictureId: pictureId,
      picture: picture,
      thumbId: thumbId,
      thumb: thumb ? thumb: 'assets/108x80.png',
      commented: 0,
      createdAt: dt, 
      sortedBy: dt
    };
 
    let houseId = Houses.collection.insert(house); 
   
    for (let i = 0; i < subPictureIdArray.length; i++) {
       let housePicture = {
         houseId: houseId,
         picture: subPictureArray[i],
         pictureId: subPictureIdArray[i],
         thumb: subThumbArray[i],
         thumbId: subThumbIdArray[i],
         createdAt: new Date()        
       }
       HousePictures.collection.insert(housePicture);
    }
   
  },
  removeHouse(houseId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(houseId, nonEmptyString);
 
    let house = Houses.collection.findOne(houseId);
 
    if (!house) throw new Meteor.Error('house-not-exists',
      '对象物件不存在。');

    if(house.thumbId) Thumbs.collection.remove({_id: house.thumbId});
    if(house.pictureId) Images.collection.remove({_id: house.pictureId});
    HousePictures.collection.remove({houseId}); 
    HouseComments.collection.remove({houseId});
    Houses.collection.remove(houseId);
    Bookmarks.collection.remove({objId: houseId});
  },
  removePicture(thumb: Thumb): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');

    if(!thumb)  return;

    if(thumb.originalId) Images.collection.remove({_id: thumb.originalId});
    Thumbs.collection.remove(thumb._id);
  },
  addHouseComment(houseId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(houseId, nonEmptyString);
    check(content, nonEmptyString);

    const house = Houses.collection.findOne(houseId);
 
    if (!house) throw new Meteor.Error('house-not-exists',
      '对象主题不存在。');
 
    let dt = new Date();
    HouseComments.collection.insert({
      objId: houseId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Houses.collection.update(houseId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });

    //add a notification to the owner
    const creator = Meteor.users.findOne(house.creatorId);
    if(creator.profile.notify && this.userId != house.creatorId)
      Notifications.collection.insert({
        objId: houseId,
        objType: 'house',
        notType: 'c',
        message: house.title,
        senderId: this.userId,
        toId: house.creatorId,
        read: false,
        createdAt: dt
      });
  },
  addJob(title: string,
          location: string,
          position: string,
           people: number,
           start: Date,
           description: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(title, nonEmptyString);
    check(location, nonEmptyString);
    check(position, nonEmptyString);
    check(description, nonEmptyString);
 
    let dt = new Date();
    const job = {
      title: title,
      location: location,
      position: position,
      people: people,
      start: start,
      description: description,
      creatorId: this.userId, 
      commented: 0,
      createdAt: dt, 
      sortedBy: dt
    };
 
    Jobs.collection.insert(job);
  },
  removeJob(jobId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(jobId, nonEmptyString);
 
    let job = Jobs.collection.findOne(jobId);
 
    if (!job) throw new Meteor.Error('job-not-exists',
      '对象JOB不存在。');

    JobComments.collection.remove({jobId});
    Jobs.collection.remove(jobId);
    Bookmarks.collection.remove({objId: jobId});
  },
  addJobComment(jobId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(jobId, nonEmptyString);
    check(content, nonEmptyString);

    const job = Jobs.collection.findOne(jobId);
 
    if (!job) throw new Meteor.Error('job-not-exists',
      '对象JOB不存在。');
 
    let dt = new Date();
    JobComments.collection.insert({
      objId: jobId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Jobs.collection.update(jobId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });

    //add a notification to the owner
    const creator = Meteor.users.findOne(job.creatorId);
    if(creator.profile.notify && this.userId != job.creatorId)
      Notifications.collection.insert({
        objId: jobId,
        objType: 'job',
        notType: 'c',
        message: job.title,
        senderId: this.userId,
        toId: job.creatorId,
        read: false,
        createdAt: dt
      });
  },
  addBookmark(id: string, type:string, title: string, createdAt: Date, thumbnail: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
    check(id, nonEmptyString);
    check(title, nonEmptyString);

    const book = Bookmarks.collection.findOne({senderId: this.userId, objId: id});
    if (book) throw new Meteor.Error('already-bookmarked',
      '你已经收藏了！');
 
    Bookmarks.collection.insert({
      objId: id,
      title: title,
      type: type,
      senderId: this.userId,
      thumbnail: thumbnail,
      createdAt: createdAt
    });
  },
  removeBookmark(bookmarkId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      '你需要登录才可以操作。');
 
    check(bookmarkId, nonEmptyString);
 
    let bookmark = Bookmarks.collection.findOne(bookmarkId);
 
    if (!bookmark) throw new Meteor.Error('bookmark-not-exists',
      '收藏不存在。');

    Bookmarks.collection.remove(bookmarkId);
  },
  checkUserExists(username: string): boolean {
    return Meteor.users.findOne({username: username}) ? true : false;
  },
  readNotification(notId: string): void {
    Notifications.collection.update(notId, {
      $set: {read: true}
    });
  },
  removeNotification(notId: string): void {
    Notifications.collection.remove(notId);
  },
  setPassword(userId: string, newPassword: string): void {
    Accounts.setPassword(userId, newPassword, (e: Error) => {
      if(e) {
        throw e;
      }
    });
  }
});
