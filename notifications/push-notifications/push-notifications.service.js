const admin = require("firebase-admin");
var serviceAccount = require("../../../../firebase-adminsdk.json");

class PushNotification {
    notificationOptions = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    /**
     * Send PushNotification to the deviceId
     * @param {string} deviceId
     * @param {string} title
     * @param {string} body
     * @returns {Promise<void>}
     */
    async sendNotificationTo(deviceId, title, body) {
        const notification = {
            title,
            body,
        }
        try {
            return await admin.messaging().sendToDevice(deviceId, { notification }, this.notificationOptions)
        } catch(e) {
            console.log(e);
        }
    }
}


module.exports = new PushNotification();