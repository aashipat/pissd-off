CREATE TABLE Washrooms (
	washroomId INT NOT NULL PRIMARY KEY,
	washroomName VARCHAR(100) NOT NULL,
	category VARCHAR(100) NOT NULL,
	street VARCHAR(100),
	openHour DECIMAL(4,2),
	closeHour DECIMAL(4,2),
	onCall BOOLEAN,
	latitude VARCHAR(100) NOT NULL,
	longitude VARCHAR(100) NOT NULL,
	score INT,
	CHECK(0 <= score AND score <= 5)
);

CREATE TABLE Reviews (
	washroomId INT NOT NULL REFERENCES Washrooms(washroomId),
	reviewId INT NOT NULL PRIMARY KEY,
	reviewTimestamp DATETIME NOT NULL,
	text VARCHAR(30) NOT NULL
);

CREATE TABLE Forms (
	washroomId INT NOT NULL REFERENCES Washrooms(washroomId),
	formId INT NOT NULL PRIMARY KEY,
	formTimestamp DATETIME NOT NULL,
	gender VARCHAR(6) NOT NULL,
	waitTime DECIMAL(5,2) NOT NULL,
	cleanliness INT,
	CHECK(0 <= cleanliness AND cleanliness <= 5),
	CHECK(gender = 'Female' OR gender = 'Male' OR gender = 'Other')
);