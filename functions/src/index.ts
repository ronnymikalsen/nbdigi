import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

export const updateFavorite = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onUpdate((change, context) => {
    const updatedItem = change.after;
    const currentCanvasId = updatedItem.get('currentCanvasId');

    return change.after.ref.parent.parent
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
  });
