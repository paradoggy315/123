DELIMITER $$

DROP PROCEDURE IF EXISTS GetAllUsers$$
CREATE PROCEDURE GetAllUsers()
BEGIN
    SELECT UserID, Username, Email, Role FROM users;
END $$

DROP PROCEDURE IF EXISTS AddUser$$
CREATE PROCEDURE AddUser(IN p_Username VARCHAR(255), IN p_Email VARCHAR(255), IN p_PasswordHash VARCHAR(255), IN p_Role VARCHAR(255))
BEGIN
    INSERT INTO users (Username, Email, PasswordHash, Role) VALUES (p_Username, p_Email, p_PasswordHash, p_Role);
END $$

DROP PROCEDURE IF EXISTS UpdateUser$$
CREATE PROCEDURE UpdateUser(IN p_UserID INT, IN p_Username VARCHAR(255), IN p_Email VARCHAR(255), IN p_PasswordHash VARCHAR(255), IN p_Role VARCHAR(255))
BEGIN
    UPDATE users 
    SET Username = p_Username, Email = p_Email, PasswordHash = p_PasswordHash, Role = p_Role
    WHERE UserID = p_UserID;
END $$

DROP PROCEDURE IF EXISTS DeleteUser$$
CREATE PROCEDURE DeleteUser(IN p_UserID INT)
BEGIN
    DELETE FROM users WHERE UserID = p_UserID;
END $$

DROP PROCEDURE IF EXISTS GetUserByID$$
CREATE PROCEDURE GetUserByID(IN p_UserID INT)
BEGIN
    SELECT * FROM users WHERE UserID = p_UserID;
END $$

DROP PROCEDURE IF EXISTS GetUserByUsername$$
CREATE PROCEDURE GetUserByUsername(IN p_Username VARCHAR(255))
BEGIN
    SELECT * FROM users WHERE Username = p_Username;
END $$

DROP PROCEDURE IF EXISTS CheckUsernameExists$$
CREATE PROCEDURE CheckUsernameExists(IN p_Username VARCHAR(255))
BEGIN
    SELECT 1 FROM users WHERE Username = p_Username LIMIT 1;
END $$

DROP PROCEDURE IF EXISTS CheckEmailExists$$
CREATE PROCEDURE CheckEmailExists(IN p_Email VARCHAR(255))
BEGIN
    SELECT 1 FROM users WHERE Email = p_Email LIMIT 1;
END $$

DELIMITER ;
