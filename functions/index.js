const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async (context) => {
      const querySnapshot = await admin
          .firestore()
          .collection("User")
          .get();

      querySnapshot.forEach(async (doc) => {
        const userId = doc.id;
        const token = doc.data().deviceToken;

        const message = {
          token: token,
          notification: {
            title: "Notification Title",
            body: "Notification Body",
          },
          data: {
            click_action: "NOTIFICATION_CLICK",
            screen: "HOME_SCREEN",
          },
        };

        const response = await admin.messaging().send(message);
        console.log(`Notification sent to ${userId} with response:`, response);
      });
    });