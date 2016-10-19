import { Meteor } from 'meteor/meteor';
import { Topics } from "../../../both/collections/topics.collection";
import { Comments } from "../../../both/collections/comments.collection";
import { Thumbs, Images } from "../../../both/collections/images.collection";
import { TopicThumbeds } from "../../../both/collections/topic-thumbed.collection";
import { check, Match } from 'meteor/check';
import { Profile } from '../../../both/models/profile.model';
 
const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});
 
Meteor.methods({
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new topic');
    check(profile, {
      name: nonEmptyString,
      picture: nonEmptyString
    });
 
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
      'User must be logged-in to create a new topic');
 
    check(receiverId, nonEmptyString);
    check(title, nonEmptyString);
    check(content, nonEmptyString);
 
    if (receiverId !== this.userId) throw new Meteor.Error('illegal-receiver',
      'Receiver must be same as  the current logged in user');
 
    const topic = {
      title: title,
      content: content,
      creatorId: receiverId, 
      pictureId: pictureId,
      picture: picture,
      thumbId: thumbId,
      thumb: thumb,
      commented: 0,
      thumbed: 0, 
      createdAt: new Date()
    };
 
    Topics.insert(topic);
  },
  removeTopic(topicId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to remove topic');
 
    check(topicId, nonEmptyString);
 
    let topic = Topics.collection.findOne(topicId);
 
    if (!topic) throw new Meteor.Error('topic-not-exists',
      'Topic doesn\'t exist');

    Thumbs.remove({_id: topic.thumbId});
    Images.remove({_id: topic.pictureId});
    TopicThumbeds.remove({topicId}); 
    Comments.remove({topicId});
    Topics.remove(topicId);
  },
  addComment(topicId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new topic');
    check(topicId, nonEmptyString);
    check(content, nonEmptyString);

    const topic = Topics.collection.findOne(topicId);
 
    if (!topic) throw new Meteor.Error('topic-not-exists',
      'Topic doesn\'t exist');
 
    Comments.collection.insert({
      topicId: topicId,
      content: content,
      createdAt: new Date()
    });

    //commented incremant
    Topics.update(topicId, {
      $inc: {commented: 1} 
    });
  },
  thumbUp(topicId: string, senderId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new topic');
    check(senderId, nonEmptyString);
    check(topicId, nonEmptyString);
    
    const thumbed = TopicThumbeds.findOne({topicId: topicId, senderId: senderId});
    if (thumbed) throw new Meteor.Error('already-thumbed',
      '你已经点过赞了！');

    //Thumbed incremant
    Topics.update(topicId, {
      $inc: {thumbed: 1} 
    });

    //insert thumbed information
    const thumbedInfo = {
      topicId: topicId,
      senderId: senderId
    };
    TopicThumbeds.insert(thumbedInfo);
  }
});
