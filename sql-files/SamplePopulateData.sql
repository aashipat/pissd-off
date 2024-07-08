INSERT INTO Washrooms (washroomId, category, street, onCall, washroomName, longitude, latitude, openHour, closeHour) VALUES 
(1, 'Comfort Station', 'TRILLIUM DR', FALSE, 'Huron Natural Area Comfort Station', '-80.4819594035969', '43.3984077313743', 7, 20),
(2, 'Comfort Station', 'BARWOOD CRES', FALSE, 'McLennan Park Comfort Station', '-80.4862696307018', '43.417479403436', 6.5, 22),
(3, 'Comfort Station', 'MAPLEWOOD PL', FALSE, 'Breithaupt Park Comfort Station', '-80.495904861268', '43.4702911256744', 12, 16.5),
(4, 'Comfort Station', 'SCHNEIDER AVE', NULL, 'Victoria Park Comfort Station Pavilion', '-80.4991974734409', '43.445158231938', NULL, NULL),
(5, 'Comfort Station', NULL, TRUE, 'Victoria Park Comfort Station Jubilee', '-80.4939821409826', '43.4475217273846', 9, 20); 

INSERT INTO Forms (washroomId, formId, waitTime, cleanliness, gender, formTimestamp) VALUES
(2, 1, 120.00, 2, 'Female', '2023-04-10 15:18:31.313'),
(1, 2, 60.23, 2, 'Female', '2020-11-05 19:35:31.313'),
(4, 3, 0.00, 2, 'Male', '2024-01-20 20:35:31.313'),
(1, 4, 30.10, 2, 'Female', '2024-09-15 10:35:31.313'),
(1, 0, 200.00, 2, 'Male', '2024-03-17 14:35:31.313'),
(1, 5, 160.00, 2, 'Other', '2024-03-17 12:35:31.313');

INSERT INTO Reviews (washroomId, reviewId, reviewTimestamp, text) VALUES
(1, 1, '2024-05-10 20:35:31.313', 'ugly place'),
(1, 2, '2023-11-22 20:35:31.313', 'this is a great place'),
(2, 3, '2021-10-23 20:35:31.313', 'very stinky'),
(2, 4, '2020-08-19 20:35:31.313', 'crazy lady next to me'),
(1, 5, '2023-04-04 20:35:31.313', 'I had a great s***'),
(4, 6, '2024-05-02 20:35:31.313', 'very clean'),
(1, 7, '2024-05-10 20:36:31.313', 'this washroom is really ugly'), 
(1, 8, '2024-05-10 20:35:00.000', 'the ugliest washroom ever');