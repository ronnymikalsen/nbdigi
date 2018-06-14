import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

admin.initializeApp();

export const updateFavorite3 = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite((event: functions.Event<DeltaDocumentSnapshot>) => {
    const data = event.data;
    admin
      .firestore()
      .collection('users/{userId}/favorites')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(v => {
          const doc = v.ref.collection('items').doc(data.id);

          if (doc) {
            doc
              .update({
                currentCanvasId: 10
              })
              .catch(err => console.log(err));
          }

          console.log('value', v);
        });
      })
      .catch(err => console.log(err));
  });
