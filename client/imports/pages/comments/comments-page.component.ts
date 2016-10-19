import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, PopoverController } from "ionic-angular";
import { Meteor } from 'meteor/meteor';
import { Topic } from "../../../../both/models/topic.model";
import { Comments } from "../../../../both/collections/comments.collection";
import { Observable, Subscription } from "rxjs";
import { Comment } from "../../../../both/models/comment.model";
import template from "./comments-page.component.html";
import * as style from "./comments-page.component.scss";
import { CommentsOptionsComponent } from './comments-options.component';
import { MeteorObservable } from "meteor-rxjs";
 
@Component({
  selector: "comments-page",
  template,
  styles: [
    style.innerHTML
  ]
})
export class CommentsPage implements OnInit, OnDestroy {
  private selectedTopic: Topic;
  private title: string;
  private picture: string;
  private comments: Observable<Comment[]>;
  private comment = "";
  private senderId: string;
  private autoScroller: Subscription;
 
  constructor(
    navParams: NavParams,
    private popoverCtrl: PopoverController
  ) {
    this.selectedTopic = <Topic>navParams.get('topic');
    this.title = this.selectedTopic.title.slice(0, 12);
    if (this.selectedTopic.title.length > 12) {
      this.title = this.title + "...";
    }
    
    this.picture = this.selectedTopic.picture; 
    this.senderId = Meteor.userId();
  }
 
  ngOnInit() {
    MeteorObservable.subscribe('comments', this.selectedTopic._id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = Comments.find(
          {topicId: this.selectedTopic._id},
          {sort: {createdAt: 1}}
        ).map((comments: Comment[]) => {
          comments.forEach((comment: Comment) => {
            comment.ownership = this.senderId == comment.senderId ? 'mine' : 'other';
          });
          return comments;
        });
      });
    });

    this.autoScroller = MeteorObservable.autorun().subscribe(() => {
      this.scroller.scrollTop = this.scroller.scrollHeight;
      this.commentEditor.focus();
    });
  }

  private get commentsPageContent(): Element {
    return document.querySelector('.comments-page-content');
  }
 
  private get commentsPageFooter(): Element {
    return document.querySelector('.comments-page-footer');
  }
 
  private get commentsList(): Element {
    return this.commentsPageContent.querySelector('.comments');
  }
 
  private get commentEditor(): HTMLInputElement {
    return <HTMLInputElement>this.commentsPageFooter.querySelector('.comment-editor');
  }
 
  private get scroller(): Element {
    return this.commentsList;
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(CommentsOptionsComponent, {
      topic: this.selectedTopic
    }, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  ngOnDestroy() {
    if (this.autoScroller) {
      this.autoScroller.unsubscribe();
      this.autoScroller = undefined;
    }
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.sendComment();
    }
  }
 
  sendComment(): void {
    MeteorObservable.call('addComment', this.selectedTopic._id, this.comment).zone().subscribe(() => {
      this.comment = '';
    });
  }
}
