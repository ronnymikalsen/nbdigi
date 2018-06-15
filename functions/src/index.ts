import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

export const updateFavorite3 = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite(
    (
      snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>,
      context: functions.EventContext
    ) => {
      const data = snapshot.after;
      const currentCanvasId = data.get('currentCanvasId');

      return snapshot.after.ref.parent.parent
        .collection('favorites')
        .get()
        .then(collections => {
          collections.forEach(snap => {
            snap.ref
              .collection('items')
              .get()
              .then(i => {
                i.forEach(hmm => {
                  if (hmm.id === data.id) {
                    hmm.ref
                      .update({
                        currentCanvasId: currentCanvasId
                      })
                      .catch(err => console.error(err));
                  }
                });
              })
              .catch(err => console.error(err));
          });
        })
        .catch(err => console.error(err));
    }
  );
