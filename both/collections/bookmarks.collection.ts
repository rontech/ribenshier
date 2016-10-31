import { Bookmark } from "../models/bookmark.model";
import { MongoObservable } from "meteor-rxjs";
 
export const Bookmarks = new MongoObservable.Collection<Bookmark>('bookmarks');
