"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFavorite = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);
exports.updateFavorite = functions.firestore
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
//# sourceMappingURL=index.js.map