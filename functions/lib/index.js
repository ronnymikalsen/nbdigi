'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
exports.updateFavorite = functions.firestore
  .document('users/{userId}/items/{messageId}')
  .onWrite((snapshot, context) => {
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
  });
//# sourceMappingURL=index.js.map
