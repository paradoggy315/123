DELIMITER $$

DROP PROCEDURE IF EXISTS `AddShippingDetails`$$
CREATE PROCEDURE `AddShippingDetails`(
    IN _PledgeID INT, 
    IN _ResponseID INT,
    IN _Carrier VARCHAR(255),
    IN _TrackingNumber VARCHAR(255),
    IN _ShippingDate DATE
)
BEGIN
    DECLARE entityType VARCHAR(10);

    INSERT INTO shipping (PledgeID, ResponseID, Carrier, TrackingNumber, ShippingDate)
    VALUES (_PledgeID, _ResponseID, _Carrier, _TrackingNumber, _ShippingDate);

    IF _PledgeID IS NOT NULL THEN
        UPDATE pledges
        SET Status = 'Shipped'
        WHERE PledgeID = _PledgeID;
        SET entityType = 'Pledge';
    ELSEIF _ResponseID IS NOT NULL THEN
        UPDATE responses
        SET Status = 'Shipped'
        WHERE ResponseID = _ResponseID;
        SET entityType = 'Response';
    END IF;

    SELECT 'Shipping details added successfully for ' AS Message, entityType AS EntityType;
END$$

DELIMITER ;
