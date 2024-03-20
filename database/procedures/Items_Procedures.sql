DELIMITER $$

DROP PROCEDURE IF EXISTS AddItem$$
CREATE PROCEDURE AddItem(IN _name VARCHAR(255), IN _category VARCHAR(255), IN _description TEXT, IN _quantity INT, IN _donorID INT, IN _location VARCHAR(255))
BEGIN
  INSERT INTO items (Name, Category, Description, quantity, donorID, location) VALUES (_name, _category, _description, _quantity, _donorID, _location);
END$$

DROP PROCEDURE IF EXISTS UpdateItem$$
CREATE PROCEDURE UpdateItem(IN _itemID INT, IN _name VARCHAR(255), IN _category VARCHAR(255), IN _description TEXT, IN _quantity INT, IN _donorID INT, IN _location VARCHAR(255))
BEGIN
  UPDATE items
  SET Name = _name, Category = _category, Description = _description, quantity = _quantity, donorID = _donorID, location = _location
  WHERE ItemID = _itemID;
END$$

DROP PROCEDURE IF EXISTS DeleteItem$$
CREATE PROCEDURE DeleteItem(IN _itemID INT)
BEGIN
  DELETE FROM items WHERE ItemID = _itemID;
END$$

DROP PROCEDURE IF EXISTS GetAllItems$$
CREATE PROCEDURE GetAllItems()
BEGIN
  SELECT * FROM items;
END$$

DROP PROCEDURE IF EXISTS GetItem$$
CREATE PROCEDURE GetItem(IN _itemID INT)
BEGIN
  SELECT * FROM items WHERE ItemID = _itemID;
END$$

DELIMITER ;
