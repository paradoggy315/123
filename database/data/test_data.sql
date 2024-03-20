-- Insert Users
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES
('adminUser', 'hashed_password', 'admin@example.com', 'Admin'),
('donorUser', 'hashed_password', 'donor@example.com', 'Donor'),
('recipientUser', 'hashed_password', 'recipient@example.com', 'Recipient'),
('volunteerUser', 'hashed_password', 'volunteer@example.com', 'Volunteer');

-- Insert Disaster Events
INSERT INTO DisasterEvents (EventName, Location, StartDate, Description) VALUES
('Flood 2024', 'Springfield', '2024-01-10', 'A severe flood affecting the Springfield area.'),
('Earthquake 2024', 'Rivertown', '2024-02-15', 'A significant earthquake causing widespread damage in the Rivertown metropolitan area.'),
('Wildfire 2023', 'Clearwater', '2023-09-05', 'An extensive wildfire causing mass evacuations and destruction of wildlife habitats near Clearwater.'),
('Hurricane Delta', 'Seabreeze', '2024-08-20', 'A powerful hurricane causing flooding, power outages, and significant damage in Seabreeze.'),
('Tornado Outbreak 2024', 'Midland Plains', '2024-04-30', 'A series of powerful tornadoes causing widespread destruction in Midland Plains.'),
('Heatwave Extreme 2024', 'Sunnyside', '2024-07-12', 'An unprecedented heatwave causing record temperatures and health emergencies in Sunnyside.');

-- Insert Items
INSERT INTO Items (Category, Description, UnitType) VALUES
('Food', 'Canned Beans', 'Cans'),
('Clothing', 'Winter Jacket', 'Pieces'),
('Medicine', 'Antibiotics', 'Boxes');

-- Assume the IDs for Users and Items are 1, 2, 3, etc., based on the insertion order above

-- Insert Requests
INSERT INTO Requests (EventID, UserID, ItemID, QuantityNeeded, Status) VALUES
(1, 3, 1, 50, 'Open'),
(1, 3, 2, 20, 'Open');

-- Insert Responses
INSERT INTO Responses (UserID, MatchedRequestID, QuantityProvided, Status) VALUES
(2, 1, 25, 'Pending'),
(2, 2, 10, 'Pending');

-- Insert Matches (assuming the Matches logic is handled externally for simplicity here)
INSERT INTO Matches (RequestID, ResponseID, AdminUserID) VALUES
(1, 1, 1),
(2, 2, 1);
