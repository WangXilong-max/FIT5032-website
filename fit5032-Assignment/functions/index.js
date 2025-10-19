const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail?.user || process.env.GMAIL_USER,
    pass: functions.config().gmail?.password || process.env.GMAIL_PASSWORD
  }
});

// ==================== Helper Functions ====================

const getUserEmail = async (userId) => {
  try {
    const userRecord = await admin.auth().getUser(userId);
    return userRecord.email || null;
  } catch (error) {
    console.error('Error fetching user email:', error.message);
    return null;
  }
};

const getUserEmails = async (userIds) => {
  const emails = [];
  for (const userId of userIds) {
    const email = await getUserEmail(userId);
    if (email) emails.push(email);
  }
  return emails;
};

const sendEmail = async (to, subject, text) => {
  if (!to || to.length === 0) return { success: false };
  try {
    const toList = Array.isArray(to) ? to.join(',') : to;
    const result = await transporter.sendMail({
      from: functions.config().gmail?.user || process.env.GMAIL_USER,
      to: toList,
      subject,
      text
    });
    console.log('✅ Email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

// ==================== Cloud Functions ====================

// 1. Activity created - notify organizer
exports.onActivityCreated = functions.firestore
  .document('activities/{activityId}')
  .onCreate(async (snap) => {
    const activity = snap.data();
    try {
      const creatorEmail = await getUserEmail(activity.creatorId);
      if (!creatorEmail) return;

      const text = `Activity "${activity.name}" created successfully!\n\nDate: ${activity.date}\nTime: ${activity.time}\nLocation: ${activity.location}\nMax Participants: ${activity.maxParticipants}`;
      
      await sendEmail(creatorEmail, `✅ Activity Created: ${activity.name}`, text);
    } catch (error) {
      console.error('Error in onActivityCreated:', error);
    }
  });

// 2. Participant joined - notify organizer
exports.onParticipantJoined = functions.firestore
  .document('activities/{activityId}')
  .onUpdate(async (change) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    try {
      if (newData.participants?.length > oldData.participants?.length) {
        const newParticipant = newData.participants.find(p => !oldData.participants.includes(p));
        
        const creatorEmail = await getUserEmail(newData.creatorId);
        const participantEmail = await getUserEmail(newParticipant);
        
        if (!creatorEmail) return;

        const text = `New participant joined "${newData.name}"!\n\nParticipant: ${participantEmail}\nTotal: ${newData.participants.length}/${newData.maxParticipants}\nDate: ${newData.date} at ${newData.time}`;
        
        await sendEmail(creatorEmail, `👤 New Participant: ${newData.name}`, text);
      }
    } catch (error) {
      console.error('Error in onParticipantJoined:', error);
    }
  });

// 3. Activity updated - notify all participants (Bulk Email)
exports.onActivityUpdated = functions.firestore
  .document('activities/{activityId}')
  .onUpdate(async (change) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    try {
      const hasChanges = 
        newData.date !== oldData.date ||
        newData.time !== oldData.time ||
        newData.location !== oldData.location;

      if (hasChanges && newData.participants?.length > 0) {
        const emails = await getUserEmails(newData.participants);
        if (emails.length === 0) return;

        let changes = [];
        if (newData.date !== oldData.date) changes.push(`Date: ${oldData.date} → ${newData.date}`);
        if (newData.time !== oldData.time) changes.push(`Time: ${oldData.time} → ${newData.time}`);
        if (newData.location !== oldData.location) changes.push(`Location: ${oldData.location} → ${newData.location}`);

        const text = `Activity "${newData.name}" has been updated!\n\nChanges:\n${changes.join('\n')}\n\nNew Details:\nDate: ${newData.date}\nTime: ${newData.time}\nLocation: ${newData.location}`;
        
        await sendEmail(emails, `⚠️ Activity Updated: ${newData.name}`, text);
      }
    } catch (error) {
      console.error('Error in onActivityUpdated:', error);
    }
  });

// 4. Activity cancelled - notify all participants (Bulk Email)
exports.onActivityCancelled = functions.firestore
  .document('activities/{activityId}')
  .onUpdate(async (change) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    try {
      if (newData.status === 'cancelled' && oldData.status !== 'cancelled') {
        const emails = await getUserEmails(newData.participants || []);
        if (emails.length === 0) return;

        const reason = newData.cancellationReason || 'No reason provided';
        const text = `Activity "${newData.name}" has been CANCELLED.\n\nReason: ${reason}\n\nDate was: ${newData.date} at ${newData.time}\nLocation: ${newData.location}`;
        
        await sendEmail(emails, `❌ Activity Cancelled: ${newData.name}`, text);
      }
    } catch (error) {
      console.error('Error in onActivityCancelled:', error);
    }
  });

// 5. Activity reminder before 24 hours (Bulk Email)
exports.activityReminderBefore24Hours = functions.pubsub
  .schedule('every 1 hours')
  .timeZone('Australia/Melbourne')
  .onRun(async () => {
    try {
      const activitiesSnapshot = await db.collection('activities').get();
      const now = new Date();
      let remindersSent = 0;

      for (const doc of activitiesSnapshot.docs) {
        const activity = doc.data();
        if (activity.status === 'cancelled') continue;

        const [year, month, day] = activity.date.split('-').map(Number);
        const [hour, minute] = activity.time.split(':').map(Number);
        const activityDateTime = new Date(year, month - 1, day, hour, minute);
        const hoursUntil = (activityDateTime - now) / (1000 * 60 * 60);

        if (hoursUntil > 0 && hoursUntil <= 24 && !activity.reminderSent24h) {
          const emails = await getUserEmails(activity.participants || []);
          if (emails.length === 0) continue;

          const text = `Reminder: "${activity.name}" starts in ${Math.round(hoursUntil)} hour(s)!\n\nDate: ${activity.date}\nTime: ${activity.time}\nLocation: ${activity.location}\n\nPlease arrive 10-15 minutes early.`;
          
          await sendEmail(emails, `⏰ Activity Reminder: ${activity.name}`, text);
          remindersSent++;

          await db.collection('activities').doc(doc.id).update({ reminderSent24h: true });
        }
      }

      console.log(`✅ Reminder task completed. Sent: ${remindersSent}`);
    } catch (error) {
      console.error('Error in activityReminderBefore24Hours:', error);
    }
  });
