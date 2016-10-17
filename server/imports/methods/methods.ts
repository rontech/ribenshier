import { Meteor } from 'meteor/meteor';
import { Topics } from "../../../both/collections/topics.collection";
import { Comments } from "../../../both/collections/comments.collection";
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
  addTopic(receiverId: string, title: string, content: string): void {
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
      picture: "assets/none.png"
    };
 
    Topics.insert(topic);
  },
  removeTopic(topicId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to remove topic');
 
    check(topicId, nonEmptyString);
 
    const topicExists = !!Topics.collection.find(topicId).count();
 
    if (!topicExists) throw new Meteor.Error('topic-not-exists',
      'Topic doesn\'t exist');
 
    Comments.remove({topicId});
    Topics.remove(topicId);
  },
  addComment(topicId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new topic');
    check(topicId, nonEmptyString);
    check(content, nonEmptyString);

    const topicExists = !!Topics.collection.find(topicId).count();
 
    if (!topicExists) throw new Meteor.Error('topic-not-exists',
      'Topic doesn\'t exist');
 
    Comments.collection.insert({
      topicId: topicId,
      content: content,
      createdAt: new Date()
    });
  }
});
