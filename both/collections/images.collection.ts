import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { Thumb, Image } from "../models/image.model";
import { UploadFS } from 'meteor/jalik:ufs'
 
export const Images = new MongoObservable.Collection<Image>('images');
export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');
 
export const ThumbsStore = new UploadFS.store.GridFS({
  collection: Thumbs.collection,
  name: 'thumbs',
  transformWrite(from, to, fileId, file) {
    // Resize to 108x80
    const gm = require('gm');
 
    gm(from, file.name)
      .resize(108, 80)
      .gravity('Center')
      .extent(108, 80)
      .quality(75)
      .stream()
      .pipe(to);
  },
  permissions: new UploadFS.StorePermissions({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    }
  })
});
 
export const ImagesStore = new UploadFS.store.GridFS({
  collection: Images.collection,
  name: 'images',
  filter: new UploadFS.Filter({
    contentTypes: ['image/*'],
    minSize: 1,
    maxSize: 1024 * 5000 // 5MB,
  }),
  transformWrite(from, to, fileId, file) {
    // Resize to 800x600
    const gm = require('gm');

    gm(from, file.name)
      .resize(800, 600)
      .gravity('Center')
      .extent(800, 600)
      .quality(75)
      .stream()
      .pipe(to);
  },
  copyTo: [
    ThumbsStore
  ],
  permissions: new UploadFS.StorePermissions({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    }
  })
});

function loggedIn(userId) {
  return !!userId;
}
 
Thumbs.collection.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  fetch: ['owner']
});
 
Images.collection.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  fetch: ['owner']
});
