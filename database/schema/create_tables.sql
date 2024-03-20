CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Role ENUM('Admin', 'Donor', 'Recipient', 'Volunteer') NOT NULL,
    CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL
);

CREATE TABLE DisasterEvents (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    EventName VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Description TEXT
);

CREATE TABLE Items (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    Category ENUM('Food', 'Clothing', 'Medicine', 'Other') NOT NULL,
    Description VARCHAR(255),
    UnitType VARCHAR(50) NOT NULL
);

CREATE TABLE Requests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    EventID INT,
    UserID INT,
    ItemID INT,
    QuantityNeeded INT NOT NULL,
    Status ENUM('Open', 'Fulfilled', 'Expired') NOT NULL,
    CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EventID) REFERENCES DisasterEvents(EventID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE Responses (
    ResponseID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    MatchedRequestID INT,
    QuantityProvided INT NOT NULL,
    Status ENUM('Pending', 'Completed', 'Shipped') NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (MatchedRequestID) REFERENCES Requests(RequestID)
);

CREATE TABLE Matches (
    MatchID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT,
    ResponseID INT,
    AdminUserID INT,
    MatchDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RequestID) REFERENCES Requests(RequestID),
    FOREIGN KEY (ResponseID) REFERENCES Responses(ResponseID),
    FOREIGN KEY (AdminUserID) REFERENCES Users(UserID)
);




