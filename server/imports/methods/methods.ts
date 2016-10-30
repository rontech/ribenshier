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
    Topics.collection.update(topicId, {
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
    Topics.collection.update(topicId, {
      $inc: {thumbed: 1} 
    });

    //insert thumbed information
    const thumbedInfo = {
      topicId: topicId,
      senderId: senderId
    };
    TopicThumbeds.collection.insert(thumbedInfo);
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
    Activities.collection.update(activityId, {
      $inc: {joined: 1} 
    });

    //insert member information
    const memberInfo = {
      activityId: activityId,
      senderId: senderId
    };
    ActivityMembers.collection.insert(memberInfo);
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
    Activities.collection.update(activityId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
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
      forRenatal: forRental,
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
      houseId: houseId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Houses.collection.update(houseId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
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
      jobId: jobId,
      senderId: this.userId,
      content: content,
      createdAt: dt
    });

    //commented incremant
    Jobs.collection.update(jobId, {
      $inc: {commented: 1},
      $set: {commentedAt: dt, sortedBy: dt, lastComment: content}
    });
  }
});
