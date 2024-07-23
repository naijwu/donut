# ubc donuts

Want to make more friends? Eat more donuts? Touch grass? UBC DONUTS is just the app for you

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
### Minimum viability
Goes without saying, list is tentative. We don't want to split the work sequentially between FE and BE so that we can test the app more effectively as we develop. 
1. Setup project (FE & BE)
    - FE: React setup with manifest.json for PWA `jaewu`
    - BE: Initialize server, open db connection using oracledb `jaewu`
2. Implement auth layer (FE & BE)
    - FE: Create login screen, create helper function for cookie/auth header handling? `david`
    - BE: Setup route to service auth handshake between oauth and FE, create auth middleware `david` `jaewu`
3. Implement pages and components (FE)
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
4. Implement routes (BE) `donald` `david` `jaewu`

| Entity/Domain  | Request | Endpoint | Description |
| ------------- | --------- | -------|------|
| Comment  | GET  | /comments/:donutID/:title | Get comments of a post |
| Comment  | POST  | /comment/:donutID/:title | Post a comment on a post (requires comment data as payload) |
| Comment  | PATCH  | /comment/:commentID | Update a comment |
| Post  | GET, POST, PATCH, DELETE | /post | CRUD a Post |
| Reaction  | POST  | /reaction/:[comment,post]/:commentID | Make a Reaction. We're assuming reactions will later be queried as a joined table with Comment |
| Profile  | GET, POST, PATCH, DELETE  | /profile/:email | CRUD a Profile |
| Notification  | GET  | /notifications/:email | Get all notifications for a user |
| Notification  | DELETE  | /notifications/:notificationID | Delete a notification |
| Donut  | GET | /donut/:donutID | Get a donut |
| Donut  | GET  | /donut/:donutID/messages | Get all messages of that donut groupchat |
| Donut  | POST  | /donut/:donutID/message | Send a message to a donut groupchat |

5. Implement pair scheduling `donald` `david`
    - Task scheduler
    - Pair matching function
6. Implement notifications `jaewu`
    - FE: Push Notification permission request
    - BE: Store push notif endpoint to Profile.settings
### Nice to haves
7. Implement realtime chat websockets `donald`


## Designs
[Figma](https://www.figma.com/design/5MwsKv2K0UF992YiA5SHGG/UBC-Donut?node-id=0-1&t=1UEKMSak5VygBJRv-0)

