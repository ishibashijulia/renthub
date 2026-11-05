import { Component, computed, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommentService } from '../../services/comment';
import { PropertyComment } from '../../models/comment';
import { DatePipe } from '@angular/common';

interface Thread {
  parent: PropertyComment;
  replies: PropertyComment[];
}

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  private commentService = inject(CommentService);
  auth = inject(AuthService);

  propertyId = input.required<number>();

  comments = signal<PropertyComment[]>([]);

  threads = computed<Thread[]>(() => {
    const all = this.comments();
    return all
      .filter((c) => c.parentId === null)
      .map((parent) => ({
        parent,
        replies: all.filter((c) => c.parentId === parent.id),
      }));
  });

  text = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  replyingTo = signal<number | null>(null);

  replyText = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  startReply(commentId: number) {
    this.replyText.reset();
    this.replyingTo.set(commentId);
  }

  cancelReply() {
    this.replyingTo.set(null);
  }

  postReply() {
    const user = this.auth.currentUser();
    const parentId = this.replyingTo();
    if (this.replyText.invalid || !user || parentId === null) {
      this.replyText.markAsTouched();
      return;
    }

    this.commentService
      .addComment({
        propertyId: this.propertyId(),
        userId: user.id,
        userName: user.name,
        text: this.replyText.value,
        parentId,
        createdAt: new Date().toISOString(),
      })
      .subscribe((created) => {
        this.comments.update((list) => [...list, created]);
        this.replyingTo.set(null);
      });
  }

  ngOnInit() {
    this.commentService.getComments(this.propertyId()).subscribe((data) => {
      this.comments.set(data);
    });
  }

  post() {
    const user = this.auth.currentUser();
    if (this.text.invalid || !user) {
      this.text.markAsTouched();
      return;
    }
    this.commentService
      .addComment({
        propertyId: this.propertyId(),
        userId: user.id,
        userName: user.name,
        text: this.text.value,
        parentId: null,
        createdAt: new Date().toISOString(),
      })
      .subscribe((created) => {
        this.comments.update((list) => [...list, created]);
        this.text.reset();
      });
  }
}
