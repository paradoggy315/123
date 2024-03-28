DELIMITER $$

DROP PROCEDURE IF EXISTS AddPledge$$
CREATE PROCEDURE AddPledge(
    IN _UserID INT, 
    IN _ItemID INT, 
    IN _QuantityPledged INT, 
    IN _Status ENUM('Pending','Fulfilled','Cancelled')
)
BEGIN
    INSERT INTO pledges (UserID, ItemID, QuantityPledged, Status) 
    VALUES (_UserID, _ItemID, _QuantityPledged, _Status);
    SELECT LAST_INSERT_ID() AS PledgeID;
END$$

DROP PROCEDURE IF EXISTS UpdatePledge$$
CREATE PROCEDURE UpdatePledge(
    IN _PledgeID INT, 
    IN _UserID INT, 
    IN _ItemID INT, 
    IN _QuantityPledged INT, 
    IN _Status ENUM('Pending','Fulfilled','Cancelled')
)
BEGIN
    UPDATE pledges
    SET UserID = _UserID, ItemID = _ItemID, QuantityPledged = _QuantityPledged, Status = _Status
    WHERE PledgeID = _PledgeID;
END$$

DROP PROCEDURE IF EXISTS DeletePledge$$
CREATE PROCEDURE DeletePledge(IN _PledgeID INT)
BEGIN
    DELETE FROM pledges WHERE PledgeID = _PledgeID;
END$$

DROP PROCEDURE IF EXISTS GetAllPledges$$
CREATE PROCEDURE GetAllPledges()
BEGIN
    SELECT 
        p.PledgeID, 
        p.QuantityPledged, 
        p.Status AS PledgeStatus, 
        i.Name AS ItemName, 
        i.Description AS ItemDescription, 
        i.Category AS ItemCategory,
        i.ItemID,
        u.UserID,
        u.Username AS DonorName
    FROM pledges p
    INNER JOIN items i ON p.ItemID = i.ItemID
    INNER JOIN users u ON p.UserID = u.UserID;
END$$

DROP PROCEDURE IF EXISTS GetPledgeByID$$
CREATE PROCEDURE GetPledgeByID(IN _PledgeID INT)
BEGIN
    SELECT * FROM pledges WHERE PledgeID = _PledgeID;
END$$

DROP PROCEDURE IF EXISTS GetUserPledges$$

CREATE PROCEDURE GetUserPledges(
    IN _UserID INT
)
BEGIN
    SELECT 
        p.PledgeID, 
        p.QuantityPledged, 
        p.Status AS PledgeStatus, 
        i.Name AS ItemName, 
        i.Description AS ItemDescription, 
        i.Category AS ItemCategory,
        i.ItemID AS ItemID
    FROM pledges p
    INNER JOIN items i ON p.ItemID = i.ItemID
    WHERE p.UserID = _UserID;
END$$

DELIMITER ;
