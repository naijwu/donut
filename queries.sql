-- other changes
-- CREATE TABLE Post - cahnged Donut to ON DELETE CASCADE
-- CREATE TABLE Post - removed Profile ON DELETE CASCADE 

------------------------------------------------------------------------------------------------

-- INSERT - add posts, accounts, comments, messages, etc.

-- (DONE IN SERVICES)

------------------------------------------------------------------------------------------------

-- DELETE - cascade-on-delete 

-- deletePost(donutID, postOrder)

DELETE FROM Post
WHERE donutID=donutID and postOrder=postOrder

-- Post DELETED -> Thread DELETED -> Thread (children) DELETED, Thread (parent) SET NULL
-- Post DELETED -> Thread DELETED -> ThreadReaction DELETED

-- deleteProfile(email)

DELETE FROM Profile
WHERE email=email

-- Profile DELETED -> BeenPaired Relation DELETED
-- Profile DELETED -> Blacklist Relation DELETED
-- Profile DELETED -> AssignedTo Relation DELETED
-- Profile DELETED -> Donut DELETED -> Post Deleted -> Thread Deleted ....

------------------------------------------------------------------------------------------------

-- UPDATE (a relation) - 2 non-primary key attributes 

UPDATE 
