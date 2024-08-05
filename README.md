# ubc donuts

Want to make more friends? Eat more donuts? Touch grass? UBC DONUTS is just the app for you

UBC donuts makes it easy for you to make new friends through assigned hangouts, or Donut dates, done at a regular interval. You'll be matched based on similar interests, age, and other factors that you can decide are relevant. Share your donut dates with others as well by posting images for what you did on the date

## Tech overview
### Frameworks
- React
- Node/Express

### Libraries/APIs
- oauth + google
- (web) pushAPI for notifications
- cron/scheduler
- oracledb
- openai
- websockets?

## Dev roadmap
### Minimum viability (MVP)
Goes without saying, list is tentative. We don't want to split the work sequentially between FE and BE so that we can test the app more effectively as we develop. 
1. Setup project (FE & BE) `Deadline: Friday July 26th`
    - FE: React setup with manifest.json for PWA `jaewu` `donald`
    - BE: Initialize server, open db connection using oracledb `jaewu`
2. Implement auth layer (FE & BE) `Deadline: Friday July 26th`
    - FE: Create login screen, create helper function for cookie/auth header handling? `david`
    - BE: Setup route to service auth handshake between oauth and FE, create auth middleware `david` `jaewu`
3. Implement pages and components (FE) `Deadline: Monday July 29th`
    - Home/Feed screen `donald` `david` `jaewu`
       - Aggregated posts component
       - Profile + Notifications link components
    - Post screen `donald` `david` `jaewu`
       - Post component
       - Comment component
       - Reaction component
    - Profile screen `donald` `david` `jaewu`
       - Profile details component
       - Edit profile component
       - Settings component
    - Notifications screen `donald` `david` `jaewu`
       - Notification component
    - Donut/Groupchat screen `donald` `david` `jaewu`
       - Donut component
       - Message component 
4. Implement routes (BE) `donald` `david` `jaewu` `Deadline: Wednesday July 31st`

| Entity/Domain  | Request | Endpoint | Description |
| ------------- | --------- | -------|------|
| Thread  | GET  | /threads/:donutID/:postOrder | Get comments of a post |
| Thread  | POST  | /threads/:donutID/:postOrder | Post a comment on a post (requires comment data as payload) |
| Thread  | PATCH  | /threads/:threadID | Update a comment |
| Thread  | PATCH  | /threads/:threadID/reaction | Create a reaction |
| Post  | GET, POST, PATCH, DELETE | /post | CRUD a Post |
| Profile  | GET, POST, PATCH, DELETE  | /profile/:email | CRUD a Profile |
| Notification  | GET  | /notifications/:email | Get all notifications for a user |
| Notification  | POST  | /notifications/:email/:message | Insert a new notification for a user |
| Notification  | DELETE  | /notifications/:notificationID | Delete a notification |
| Donut  | GET | /donut/:donutID | Get a donut |
| Donut  | GET  | /donut/:donutID/messages | Get all messages of that donut groupchat |
| Donut  | POST  | /donut/:donutID/message | Send a message to a donut groupchat |

5. Implement pair scheduling `donald` `david` `Deadline: Wednesday July 31st`
    - Task scheduler
    - Pair matching function
6. Implement notifications `jaewu` `Deadline: Friday August 2nd`
    - FE: Push Notification permission request
    - BE: Store push notif endpoint to Profile.settings
### Nice to haves + Potential challenges
7. Implement realtime chat websockets `donald`
8. Implementing an algorithm (e.g. YouTube) to show trending posts at the top `donald`

## Milestone Deliverables
The deliverables from milestones 1 and 2 are available in the repository.

## Designs
[Figma](https://www.figma.com/design/5MwsKv2K0UF992YiA5SHGG/UBC-Donut?node-id=0-1&t=1UEKMSak5VygBJRv-0)
- Screenshots of the UI/UX components can be found in this readme.md below

Login:

![login](https://media.github.students.cs.ubc.ca/user/17165/files/852f1534-a7ce-4ceb-877a-3ad46173c7d4)

Home/Feed:

![homefeed](https://media.github.students.cs.ubc.ca/user/17165/files/91064e99-717b-484e-b1c0-23f422eb3443)

Post:

![post](https://media.github.students.cs.ubc.ca/user/17165/files/1e3746fa-adf6-40d6-80de-59aa224f4e2a)

Profile:

![Profile Screen](https://media.github.students.cs.ubc.ca/user/21790/files/3bd7eedf-04f6-499d-93e0-c79dcda59346)

Edit Profile:

![editprofile](https://media.github.students.cs.ubc.ca/user/17165/files/e62afcaa-d341-490a-a33f-f7268271f094)

Donuts:

![donuts](https://media.github.students.cs.ubc.ca/user/17165/files/d01adefd-ac26-4546-9793-6d2ff22221ec)

Donut/GC:

![donutgc](https://media.github.students.cs.ubc.ca/user/17165/files/cc66e53b-782e-43ba-a420-2d815adc2aa1)

Edit Post:

![editpost](https://media.github.students.cs.ubc.ca/user/17165/files/0240d80f-ffde-487c-9317-1c8f2b7a41db)

Notifications:

![notifications](https://media.github.students.cs.ubc.ca/user/17165/files/a9290c7d-24fc-4577-855b-5ec8a38f9f12)

## ERD
![304 drawio](https://media.github.students.cs.ubc.ca/user/17165/files/0258b3e4-52f6-45f2-bd07-b9e5592f0e1a)

