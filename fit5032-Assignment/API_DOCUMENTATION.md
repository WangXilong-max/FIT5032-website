# SportSync REST API Documentation

## Overview
This document describes the REST API endpoints available for third-party developers to access SportSync platform data.

## Base URL
```
Firebase Firestore Collections
```

## Authentication
All API calls require Firebase Authentication. Users must be authenticated to access the endpoints.

## Available Collections (Tables)

### 1. Activities Collection
**Collection Path**: `/activities`

Contains all sports activities created on the platform.

#### Data Structure
```json
{
  "id": "string (auto-generated)",
  "name": "string",
  "category": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "location": "string",
  "latitude": "number",
  "longitude": "number",
  "maxParticipants": "number",
  "price": "number",
  "description": "string",
  "equipment": "string",
  "status": "string (upcoming/ongoing/completed)",
  "participants": "array of user IDs",
  "participantCount": "number",
  "ratings": "array of rating objects",
  "averageRating": "number",
  "creatorId": "string (user ID)",
  "creatorName": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2. Users Collection
**Collection Path**: `/users`

Contains user profile information.

#### Data Structure
```json
{
  "id": "string (user ID)",
  "email": "string",
  "displayName": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3. Participants (Embedded in Activities)
Participants are stored as an array within each activity document.

### 4. Ratings (Embedded in Activities)
Ratings are stored as an array within each activity document.

#### Rating Object Structure
```json
{
  "rating": "number (1-5)",
  "userId": "string",
  "timestamp": "number"
}
```

## API Functions

### Activities API

#### 1. Get All Activities
```javascript
import { getAllActivities } from '@/firebase/database'
const activities = await getAllActivities()
```

**Returns**: Array of all activity objects

**Example Response**:
```json
[
  {
    "id": "abc123",
    "name": "Basketball Game",
    "category": "Basketball",
    "date": "2025-10-25",
    "time": "18:00",
    "location": "Melbourne Sports Center",
    "maxParticipants": 10,
    "participantCount": 3,
    "status": "upcoming",
    "averageRating": 4.5
  }
]
```

#### 2. Get Activity by ID
```javascript
import { getActivityById } from '@/firebase/database'
const activity = await getActivityById('abc123')
```

**Parameters**: 
- `activityId` (string): The ID of the activity

**Returns**: Single activity object or null

#### 3. Create Activity
```javascript
import { createActivity } from '@/firebase/database'
const newActivity = await createActivity({
  name: "Basketball Game",
  category: "Basketball",
  date: "2025-10-25",
  time: "18:00",
  location: "Melbourne Sports Center",
  maxParticipants: 10,
  price: 0,
  description: "Friendly basketball game",
  equipment: "Bring your own ball",
  latitude: -37.8136,
  longitude: 144.9631,
  status: "upcoming",
  creatorId: "user123",
  creatorName: "john@example.com"
})
```

**Returns**: Created activity with generated ID

#### 4. Update Activity
```javascript
import { updateActivity } from '@/firebase/database'
const success = await updateActivity('abc123', {
  name: "Updated Basketball Game",
  maxParticipants: 12
})
```

**Parameters**:
- `activityId` (string): The ID of the activity
- `updates` (object): Fields to update

**Returns**: Boolean (success/failure)

#### 5. Delete Activity
```javascript
import { deleteActivity } from '@/firebase/database'
const success = await deleteActivity('abc123')
```

**Parameters**:
- `activityId` (string): The ID of the activity

**Returns**: Boolean (success/failure)

#### 6. Get Activities by Creator
```javascript
import { getActivitiesByCreator } from '@/firebase/database'
const userActivities = await getActivitiesByCreator('user123')
```

**Parameters**:
- `userId` (string): The creator's user ID

**Returns**: Array of activities created by the user

### Participants API

#### 7. Join Activity
```javascript
import { joinActivity } from '@/firebase/database'
const success = await joinActivity('abc123', 'user456')
```

**Parameters**:
- `activityId` (string): The ID of the activity
- `userId` (string): The user's ID

**Returns**: Boolean (success/failure)

#### 8. Leave Activity
```javascript
import { leaveActivity } from '@/firebase/database'
const success = await leaveActivity('abc123', 'user456')
```

**Parameters**:
- `activityId` (string): The ID of the activity
- `userId` (string): The user's ID

**Returns**: Boolean (success/failure)

#### 9. Get Joined Activities
```javascript
import { getJoinedActivities } from '@/firebase/database'
const joinedActivities = await getJoinedActivities('user456')
```

**Parameters**:
- `userId` (string): The user's ID

**Returns**: Array of activities the user has joined

### Ratings API

#### 10. Add Rating
```javascript
import { addRating } from '@/firebase/database'
const success = await addRating('abc123', 5, 'user456')
```

**Parameters**:
- `activityId` (string): The ID of the activity
- `rating` (number): Rating value (1-5)
- `userId` (string): The user's ID

**Returns**: Boolean (success/failure)

### Users API

#### 11. Save User Profile
```javascript
import { saveUserProfile } from '@/firebase/database'
const success = await saveUserProfile('user123', {
  email: 'john@example.com',
  displayName: 'John Doe'
})
```

**Parameters**:
- `userId` (string): The user's ID
- `userData` (object): User profile data

**Returns**: Boolean (success/failure)

#### 12. Get User Profile
```javascript
import { getUserProfile } from '@/firebase/database'
const user = await getUserProfile('user123')
```

**Parameters**:
- `userId` (string): The user's ID

**Returns**: User object or null

### Dashboard API

#### 13. Get Dashboard Statistics
```javascript
import { getDashboardStats } from '@/firebase/database'
const stats = await getDashboardStats()
```

**Returns**: Object with dashboard statistics

**Example Response**:
```json
{
  "totalActivities": 50,
  "upcomingActivities": 30,
  "ongoingActivities": 15,
  "totalParticipants": 200,
  "averageRating": 4.3,
  "categoryCounts": {
    "Basketball": 15,
    "Soccer": 20,
    "Tennis": 10,
    "Swimming": 5
  },
  "recentActivities": [...]
}
```

## REST API Endpoints (For External Access)

To expose these functions as REST API endpoints, you need to create Firebase Cloud Functions or a Node.js Express server.

### Recommended REST Endpoints Structure:

```
GET    /api/activities              - Get all activities
GET    /api/activities/:id          - Get activity by ID
POST   /api/activities              - Create new activity
PUT    /api/activities/:id          - Update activity
DELETE /api/activities/:id          - Delete activity
GET    /api/activities/creator/:id  - Get activities by creator
GET    /api/users/:id/joined        - Get joined activities
POST   /api/activities/:id/join     - Join activity
POST   /api/activities/:id/leave    - Leave activity
POST   /api/activities/:id/rate     - Rate activity
GET    /api/users/:id               - Get user profile
PUT    /api/users/:id               - Update user profile
GET    /api/dashboard/stats         - Get dashboard statistics
```

## Error Handling

All functions use try-catch blocks and return:
- **Success**: Expected data or `true`
- **Failure**: Empty array, `null`, or `false` depending on the function
- **Console Logs**: Detailed error messages for debugging

## Rate Limiting

Firebase Firestore has the following free tier limits:
- 50,000 document reads per day
- 20,000 document writes per day
- 20,000 document deletes per day

## Security Rules

Make sure to configure Firebase Security Rules to protect your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Activities - anyone can read, only authenticated users can write
    match /activities/{activityId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      (resource.data.creatorId == request.auth.uid || 
                       request.resource.data.participants != null);
      allow delete: if request.auth != null && 
                      resource.data.creatorId == request.auth.uid;
    }
    
    // Users - only owner can read/write
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Support

For questions or issues, contact the development team at:
- Email: contact@sportsync.com
- GitHub: https://github.com/WangXilong-max/FIT5032-website

## Version

API Version: 1.0.0
Last Updated: October 19, 2025
