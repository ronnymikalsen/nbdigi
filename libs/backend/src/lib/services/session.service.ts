import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Item, User } from '@nbdigi/data-models';
import * as firebase from 'firebase';

@Injectable()
export class SessionService {
  private userRef: AngularFirestoreDocument<User>;

  constructor() {}

  createUserIfNotExists(user: User) {
    this.userRef.ref.get().then(u => {
      if (!u.exists) {
        this.userRef.set(user);
      }
    });
  }

  updateTheme(theme: string) {
    this.userRef.update({
      theme: theme
    });
  }

  updateDebugOn(isDebugOn: boolean) {
    this.userRef.update({
      isDebugOn: isDebugOn
    });
  }

  updateItem(item: Item) {
    this.userRef
      .collection('items')
      .doc(item.id)
      .set({
        ...item,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}
