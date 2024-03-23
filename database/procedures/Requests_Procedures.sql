DELIMITER $$

DROP PROCEDURE IF EXISTS GetAllRequests$$
CREATE PROCEDURE `GetAllRequests`()
BEGIN
    SELECT * FROM requests;
END $$

DROP PROCEDURE IF EXISTS AddRequest$$
CREATE PROCEDURE `AddRequest`(
    IN p_EventID INT, 
    IN p_UserID INT, 
    IN p_ItemID INT, 
    IN p_QuantityNeeded INT, 
    IN p_Status ENUM('Open', 'Fulfilled', 'Expired'), 
    IN p_CreateDate TIMESTAMP
)
BEGIN
    INSERT INTO requests (EventID, UserID, ItemID, QuantityNeeded, Status, CreateDate) 
    VALUES (p_EventID, p_UserID, p_ItemID, p_QuantityNeeded, p_Status, p_CreateDate);
END $$

DROP PROCEDURE IF EXISTS UpdateRequest$$
CREATE PROCEDURE `UpdateRequest`(
    IN p_RequestID INT, 
    IN p_EventID INT, 
    IN p_UserID INT, 
    IN p_ItemID INT, 
    IN p_QuantityNeeded INT, 
    IN p_Status ENUM('Open', 'Fulfilled', 'Expired')
)
BEGIN
    UPDATE requests 
    SET EventID = p_EventID, UserID = p_UserID, ItemID = p_ItemID, QuantityNeeded = p_QuantityNeeded, Status = p_Status
    WHERE RequestID = p_RequestID;
END $$

DROP PROCEDURE IF EXISTS DeleteRequest$$
CREATE PROCEDURE `DeleteRequest`(
    IN p_RequestID INT
)
BEGIN
    DELETE FROM requests WHERE RequestID = p_RequestID;
END $$

DROP PROCEDURE IF EXISTS GetRequestByID$$
CREATE PROCEDURE `GetRequestByID`(
    IN p_RequestID INT
)
BEGIN
    SELECT 
        r.RequestID, 
        r.ItemID,
        r.QuantityNeeded,
        r.Status,
        r.CreateDate,
        i.Name AS ItemName,
        i.Category,
        i.Description AS ItemDescription,
        d.EventName,
        d.Location,
        d.StartDate
    FROM requests r
    JOIN disasterevents d ON r.EventID = d.EventID
    LEFT JOIN items i ON r.ItemID = i.ItemID
    WHERE r.RequestID = p_RequestID;
END $$

DROP PROCEDURE IF EXISTS GetRequestsAndEventsInfo$$
CREATE PROCEDURE `GetRequestsAndEventsInfo`()
BEGIN
    SELECT 
        r.RequestID, 
        r.ItemID,
        i.Name, 
        i.Category, 
        r.QuantityNeeded, 
        d.Location, 
        d.EventName, 
        d.StartDate
    FROM requests r
    JOIN disasterevents d ON r.EventID = d.EventID
    JOIN items i ON r.ItemID = i.ItemID; 
END $$

DELIMITER ;
