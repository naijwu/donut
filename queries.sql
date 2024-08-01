-- other changes
-- CREATE TABLE Post (Donut ON DELETE CASCADE)

-- INSERT - add posts, accounts, comments, messages, etc.

-- (DONE IN SERVICES)

-- DELETE - cascade-on-delete 

-- Profile(email) cascade, Donut(donutID) SET NULL
-- deletePost(donutID, postOrder)

DELETE FROM Post
WHERE donutID=donutID and postOrder=postOrder

-- POST DELETED -> Thread DELETED -> Thread (children) DELETED, Thread (parent) SET NULL
-- POST DELETED -> Thread DELETED -> ThreadReaction DELETED

-- Profile