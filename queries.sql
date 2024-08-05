-- other changes
-- CREATE TABLE Post - cahnged Donut to ON DELETE CASCADE
-- CREATE TABLE Post - removed Profile ON DELETE CASCADE 
-- Changed Hobby table to include "category" attribute

-- const HobbyEnum = Object.freeze({
--   SPORTS: "Sports",
--   MUSIC: "Music",
--   ART: "Art",
--   MEDIA: "Media",
--   GAMING: "Gaming",
--   OTHER: "Other",
-- });

------------------------------------------------------------------------------------------------

-- INSERT - add posts, accounts, comments, messages, etc.

-- (DONE IN SERVICES)

------------------------------------------------------------------------------------------------

-- DELETE - cascade-on-delete 

-- deletePost(donutID, postOrder)

DELETE FROM Post
WHERE donutID=donutID and postOrder = :postOrder

-- Post DELETED -> Thread DELETED -> Thread (children) DELETED, Thread (parent) SET NULL
-- Post DELETED -> Thread DELETED -> ThreadReaction DELETED

-- deleteProfile(email)

DELETE FROM Profile
WHERE email = :email

-- Profile DELETED -> BeenPaired Relation DELETED
-- Profile DELETED -> Blacklist Relation DELETED
-- Profile DELETED -> AssignedTo Relation DELETED
-- Profile DELETED -> Donut DELETED -> Post Deleted -> Thread Deleted ....

------------------------------------------------------------------------------------------------

-- UPDATE (a relation) - 2 non-primary key attributes 

-- updateProfile()

UPDATE Profile 
SET gender=:gender,age=:age,fullName=:fullName,enabled=:enabled,year=:year,major=:major,settings=:settings,address=:address,postalCode=:postalCode,pictureURL=:pictureURL
WHERE email = :email

------------------------------------------------------------------------------------------------

-- Selection (dyanmic WHERE + AND/OR)

-- findHobby(startsWith, category)

-- CATEGORIES:
--   SPORTS: "Sports",
--   MUSIC: "Music",
--   ART: "Art",
--   MEDIA: "Media",
--   GAMING: "Gaming",
--   OTHER: "Other",

SELECT * FROM hobbies
WHERE hobby LIKE 'startsWith%'
AND category = :category

------------------------------------------------------------------------------------------------

-- Projection (SELECT specific attributes)
-- TODO: create admin page - need to pick relation first, then attributes

------------------------------------------------------------------------------------------------

-- JOIN

-- engagementCount(donutID, postOrder)
-- TODO: display engagement count for every post (can probably add as attribute but more work :/ )

SELECT ( 
    (SELECT COUNT(*) 
     FROM Thread
     INNER JOIN ThreadReaction ON Thread.threadID = ThreadReaction.threadID
     WHERE Thread.donutID = :donutID AND Thread.postOrder = :postOrder) 
    + 
    (SELECT COUNT(*) 
     FROM PostReaction
     WHERE donutID = :donutID AND postOrder = :postOrder)
) AS total_reaction_count

------------------------------------------------------------------------------------------------

-- GROUP BY (Aggregation)

-- donutCount(email)
-- TODO: requires a dropdown for month selection

SELECT TO_CHAR(Donut.createdAt, 'YYYY-MM') AS donut_created_month, COUNT(*) AS donut_count
FROM Profile
INNER JOIN AssignedTo ON Profile.email = AssignedTo.profile
INNER JOIN Donut ON AssignedTo.donutID = Donut.donutID
WHERE Profile.email = :email
GROUP BY TO_CHAR(Donut.createdAt, 'YYYY-MM')
ORDER BY donut_created_month

------------------------------------------------------------------------------------------------

-- HAVING (Aggregation)

-- filterLessReactions()
-- TODO: include filter button for < 3 reactions + setup re-population of posts 

SELECT donutID, postOrder, COUNT(*) AS reaction_count
FROM PostReaction
GROUP BY donutID, postOrder
HAVING COUNT(*) < 3
ORDER BY reaction_count ASC

---------------------------------------------------------------------------------------------

-- GROUP BY (Nested Aggregation)

-- emojiAnalytics()
-- TODO: include "in-post" analytics for most popular emoji's

SELECT reaction_type, AVG(reaction_count) AS avg_reaction_count
FROM (
    SELECT emoji AS reaction_type, COUNT(*) as reaction_count
    FROM ThreadReaction
    GROUP BY emoji

    UNION ALL

    SELECT emoji AS reaction_type, COUNT(*) AS reaction_count
    FROM PostReaction
    GROUP BY emoji
) AS reactions
GROUP BY reaction_type

---------------------------------------------------------------------------------------------

-- Division

-- matchingProfiles(email)

SELECT P.email
FROM Profile P
WHERE NOT EXISTS (
    SELECT PH.hobby
    FROM ProfileHobby PH
    WHERE PH.profile = :email
    EXCEPT
    SELECT PH2.hobby
    FROM ProfileHobby PH2
    WHERE PH2.profile = P.email
)
AND NOT EXISTS (
    SELECT PH2.hobby
    FROM ProfileHobby PH2
    WHERE PH2.profile = P.email
    EXCEPT
    SELECT PH.hobby
    FROM ProfileHobby PH
    WHERE PH.profile = :email
)
AND P.email <> :email
LIMIT 1;