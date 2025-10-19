// Email Service using EmailJS
import emailjs from '@emailjs/browser'

// EmailJS Configuration
// Replace these with your actual EmailJS credentials
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'UvZ67Rz-GRXJRgmAF',
  SERVICE_ID: 'service_tf51dhs', // Replace with your EmailJS Service ID
  TEMPLATE_ID: 'template_7zaefve' // Replace with your EmailJS Template ID
}

/**
 * Initialize EmailJS with your public key
 */
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
}

/**
 * Send email notification to activity organizer when someone books their activity
 * @param {Object} params - Email parameters
 * @param {string} params.organizerEmail - Email of the activity organizer
 * @param {string} params.organizerName - Name of the activity organizer
 * @param {string} params.activityName - Name of the activity
 * @param {string} params.participantName - Name of the participant who booked
 * @param {string} params.participantEmail - Email of the participant
 * @param {string} params.activityDate - Date of the activity
 * @param {string} params.activityTime - Time of the activity
 * @param {string} params.activityLocation - Location of the activity
 * @returns {Promise} EmailJS response
 */
export const sendActivityBookingNotification = async ({
  organizerEmail,
  organizerName,
  activityName,
  participantName,
  participantEmail,
  activityDate,
  activityTime,
  activityLocation
}) => {
  try {
    // Prepare template parameters
    const templateParams = {
      to_email: organizerEmail,
      to_name: organizerName,
      activity_name: activityName,
      participant_name: participantName,
      participant_email: participantEmail,
      activity_date: activityDate,
      activity_time: activityTime,
      activity_location: activityLocation,
      message: `${participantName} (${participantEmail}) has booked your activity "${activityName}" scheduled for ${activityDate} at ${activityTime}.`
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return {
      success: true,
      response
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email notification'
    }
  }
}

/**
 * Send a generic email with attachment support
 * @param {Object} params - Email parameters
 * @param {string} params.toEmail - Recipient email
 * @param {string} params.toName - Recipient name
 * @param {string} params.subject - Email subject
 * @param {string} params.message - Email message
 * @param {string} params.attachmentUrl - Optional attachment URL
 * @returns {Promise} EmailJS response
 */
export const sendEmail = async ({ toEmail, toName, subject, message, attachmentUrl }) => {
  try {
    const templateParams = {
      to_email: toEmail,
      to_name: toName,
      subject: subject,
      message: message,
      attachment_url: attachmentUrl || ''
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return {
      success: true,
      response
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email'
    }
  }
}
