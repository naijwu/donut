# ubc donuts

Want to make more friends? Eat more donuts? Touch grass? UBC DONUTS is just the app for you

UBC donuts makes it easy for you to make new friends through assigned hangouts, or Donut dates, done at a regular interval. You'll be matched based on similar interests, age, and other factors that you can decide are relevant. Share your donut dates with others as well by posting images for what you did on the date

## Tech overview
### Frameworks
- React
- Node/Express

### Libraries/APIs
- oauth2.0 + google -> [view commit](https://github.com/naijwu/donut/commit/56050168f4bbe2c6a9dd1182b818ff8da63395a9)
- (web) pushAPI for notifications -> [view commit](https://github.com/naijwu/donut/commit/41717a2f3bbe7d73ed1eeaf3bbb1e380ce8ff351)
- ~cron/scheduler~
- oracledb
- ~openai~
- websockets -> [view commit](https://github.com/naijwu/donut/commit/8a93afc77551efc21514066338ce42aec4c1999a)

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
