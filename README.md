# ubc donuts

Want to make more friends? Eat more donuts? Touch grass? UBC DONUTS is just the app for you

## Tech overview
#### Frameworks
- React
- Node/Express

#### Libraries/APIs
- Google OAuth
- PushAPI (web) for notifications
- cron/scheduler
- oracledb
- openai
- websockets?

## Dev roadmap
#### Minimum viability
Obviously, subject to change
- Setup project (FE & BE)
    - FE: React setup with manifest.json for PWA
    - BE: Initialize server, open db connection using oracledb
- Implement auth layer (FE & BE)
    - FE: Login screen
    - BE: Setup routes to service auth handshake between oauth and FE
- Implement pages and components (FE)
    - Home/Feed screen
       - Aggregated posts component
    - Post screen
       - Post component
       - Comment component
       - Reaction component
    - Profile screen
       - Edit profile component
       - Settings component
    - Notifications screen
       - Notification component
    - Donut/Groupchat screen
       - Donut component
       - Message component 
- Implement routes (BE)
    - Comment handling 
        - GET: /comments/:donutID/:title
        - POST: /comment/:donutID/:title (params: poster, text)
        - UPDATE: /comment/:commentID (params: donutID, title)
    - Post handling
        - GET: /post
    - Reaction handling
    - Profile handling
    - Notification handling
        - GET: /notifications/:email
        - DELETE: /notifications/:notificationID
    - Donut handling
- Implement pair scheduling
    - Task scheduler
    - Pair matching function
- Implement notifications
    - Add 
#### Nice to haves
- Implement realtime chat websockets

## Designs
[Figma](https://www.figma.com/design/5MwsKv2K0UF992YiA5SHGG/UBC-Donut?node-id=0-1&t=1UEKMSak5VygBJRv-0)
