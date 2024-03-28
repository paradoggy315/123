DELIMITER $$

DROP PROCEDURE IF EXISTS GetAllResponses$$
CREATE PROCEDURE `GetAllResponses`(IN p_RequestID INT)
BEGIN
    SELECT 
        res.ResponseID, 
        res.QuantityProvided, 
        res.Status AS ResponseStatus, 
        usr.Username AS UserName, 
        usr.Region AS ShippingFrom
    FROM responses res
    JOIN users usr ON res.UserID = usr.UserID
    WHERE res.MatchedRequestID = p_RequestID;
END $$

DROP PROCEDURE IF EXISTS AddResponse$$
CREATE PROCEDURE `AddResponse`(
    IN p_UserID INT, 
    IN p_MatchedRequestID INT, 
    IN p_QuantityProvided INT, 
    IN p_Status ENUM('Pending', 'Completed', 'Shipped')
)
BEGIN
    INSERT INTO responses (UserID, MatchedRequestID, QuantityProvided, Status) 
    VALUES (p_UserID, p_MatchedRequestID, p_QuantityProvided, p_Status);
END $$

DROP PROCEDURE IF EXISTS UpdateResponse$$
CREATE PROCEDURE `UpdateResponse`(
    IN p_ResponseID INT, 
    IN p_UserID INT, 
    IN p_MatchedRequestID INT, 
    IN p_QuantityProvided INT, 
    IN p_Status ENUM('Pending', 'Completed', 'Shipped')
)
BEGIN
    UPDATE responses 
    SET UserID = p_UserID, MatchedRequestID = p_MatchedRequestID, QuantityProvided = p_QuantityProvided, Status = p_Status
    WHERE ResponseID = p_ResponseID;
END $$

DROP PROCEDURE IF EXISTS DeleteResponse$$
CREATE PROCEDURE `DeleteResponse`(
    IN p_ResponseID INT
)
BEGIN
    DELETE FROM responses WHERE ResponseID = p_ResponseID;
END $$

DROP PROCEDURE IF EXISTS GetResponseByID$$
CREATE PROCEDURE `GetResponseByID`(
    IN p_ResponseID INT
)
BEGIN
    SELECT * FROM responses WHERE ResponseID = p_ResponseID;
END $$

-- New procedure to create a response and update request quantity
DROP PROCEDURE IF EXISTS CreateResponseAndUpdateRequest$$
CREATE PROCEDURE `CreateResponseAndUpdateRequest`(
    IN p_UserID INT,
    IN p_MatchedRequestID INT,
    IN p_QuantityProvided INT,
    IN p_Status ENUM('Pending', 'Completed', 'Shipped')
)
BEGIN
    DECLARE new_quantity_needed INT;

    -- Add the response
    INSERT INTO responses (UserID, MatchedRequestID, QuantityProvided, Status)
    VALUES (p_UserID, p_MatchedRequestID, p_QuantityProvided, p_Status);

    -- Calculate the new quantity needed
    SELECT QuantityNeeded - p_QuantityProvided INTO new_quantity_needed
    FROM requests
    WHERE RequestID = p_MatchedRequestID;

    -- Check if the new quantity needed is less than 0, if so, set it to 0
    IF new_quantity_needed < 0 THEN
        SET new_quantity_needed = 0;
    END IF;

    -- Update the quantity needed for the request
    UPDATE requests
    SET QuantityNeeded = new_quantity_needed
    WHERE RequestID = p_MatchedRequestID;

    -- Optionally, you can handle the case where the quantity needed reaches zero
    -- and set the status of the request to 'Fulfilled'
    IF new_quantity_needed = 0 THEN
        UPDATE requests
        SET Status = 'Fulfilled'
        WHERE RequestID = p_MatchedRequestID;
    END IF;
END $$

DELIMITER ;
