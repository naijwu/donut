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
-- TODO: create search function findHobby; searchbar for startsWith; category selected by dropdown

SELECT * FROM hobbies
WHERE hobby LIKE 'startsWith%'
AND category = :category

------------------------------------------------------------------------------------------------

-- Projection (SELECT specific attributes)
-- TODO: create admin page - need to pick relation first, then attributes

------------------------------------------------------------------------------------------------

-- JOIN

-- numberOfDonuts(email)
-- TODO: requires a dropdown for month selection

SELECT TO_CHAR(Donut.createdAt, 'YYYY-MM') AS donut_created_month, COUNT(*) AS donut_count
FROM Profile
INNER JOIN AssignedTo ON Profile.email = AssignedTo.profile
INNER JOIN Donut ON AssignedTo.donutID = Donut.donutID
WHERE Profile.email = :email
GROUP BY TO_CHAR(Donut.createdAt, 'YYYY-MM')
ORDER BY donut_created_month;

------------------------------------------------------------------------------------------------

-- GROUP BY (Aggregation)



------------------------------------------------------------------------------------------------

-- HAVING (Aggregation)

-- TODO: include filter button for < 3 reactions + setup re-population of posts 

SELECT donutID, postOrder, COUNT(*) AS reaction_count
FROM PostReaction
GROUP BY donutID, postOrder
HAVING COUNT(*) < 3
ORDER BY reaction_count ASC

---------------------------------------------------------------------------------------------

-- GROUP BY (Nested Aggregation)
SELECT S.rating
FROM Sailors S
WHERE AVG(S.age) <= ALL ( SELECT AVG(s2.age)
FROM Sailors s2
GROUP BY rating );

---------------------------------------------------------------------------------------------

-- Division