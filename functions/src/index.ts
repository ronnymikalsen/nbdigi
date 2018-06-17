import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

export const updateFavorite = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite(
    (
      snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>,
      context: functions.EventContext
    ) => {
      const updatedItem = snapshot.after;
      const currentCanvasId = updatedItem.get('currentCanvasId');

      return snapshot.after.ref.parent.parent
        .collection('favorites')
        .get()
        .then(favorites => {
          favorites.forEach(favorite => {
            favorite.ref
              .collection('items')
              .get()
              .then(items => {
                items.forEach(item => {
                  if (item.id === updatedItem.id) {
                    item.ref
                      .update({
                        currentCanvasId: currentCanvasId,
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
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
