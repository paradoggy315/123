DELIMITER $$

CREATE PROCEDURE GetAllDisasterEvents()
BEGIN
    SELECT * FROM disasterevents;
END $$

CREATE PROCEDURE AddDisasterEvent(IN p_EventName VARCHAR(255), IN p_Location VARCHAR(255), IN p_StartDate DATE, IN p_EndDate DATE, IN p_Description TEXT)
BEGIN
    INSERT INTO disasterevents (EventName, Location, StartDate, EndDate, Description) 
    VALUES (p_EventName, p_Location, p_StartDate, p_EndDate, p_Description);
END $$

CREATE PROCEDURE UpdateDisasterEvent(IN p_EventID INT, IN p_EventName VARCHAR(255), IN p_Location VARCHAR(255), IN p_StartDate DATE, IN p_EndDate DATE, IN p_Description TEXT)
BEGIN
    UPDATE disasterevents 
    SET EventName = p_EventName, Location = p_Location, StartDate = p_StartDate, EndDate = p_EndDate, Description = p_Description
    WHERE EventID = p_EventID;
END $$

CREATE PROCEDURE DeleteDisasterEvent(IN p_EventID INT)
BEGIN
    DELETE FROM disasterevents WHERE EventID = p_EventID;
END $$

CREATE PROCEDURE GetDisasterEventByID(IN p_EventID INT)
BEGIN
    SELECT * FROM disasterevents WHERE EventID = p_EventID;
END $$

DELIMITER ;
