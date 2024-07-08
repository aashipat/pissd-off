CREATE VIEW WashroomScores AS
WITH FormWaitTimes AS (
	SELECT f.washroomId, 
	MIN(f.waitTime) AS washroomMin,
	MAX(f.waitTime) AS washroomMax,
    AVG(f.waitTime) AS washroomAvg
    FROM Forms f
	GROUP BY f.washroomId
),
AverageWaitTime AS (
	SELECT AVG(washroomMin) AS minAvg, AVG(washroomMax) AS maxAvg
	FROM FormWaitTimes
),
WaitTimeScore AS (
	SELECT f.washroomId,
	CASE
		WHEN f.washroomAvg <= a.minAvg THEN 5
		WHEN f.washroomAvg >= a.maxAvg THEN 1
		ELSE 5 - (4 * (f.washroomAvg - a.minAvg) / (a.maxAvg - a.minAvg))
	END AS waitTimeScore
	FROM FormWaitTimes f, AverageWaitTime a
),
GenderWaitTime AS (
	SELECT f.washroomId, f.gender, AVG(f.waitTime) AS avgGenWaitTime
	FROM Forms f
	GROUP BY f.washroomId, f.gender
),
GenderDiff AS (
	SELECT g1.washroomId, MAX(ABS(g1.avgGenWaitTime - g2.avgGenWaitTime)) AS diff
	FROM GenderWaitTime g1, GenderWaitTime g2
	WHERE g1.washroomId = g2.washroomId AND
		g1.gender = 'Female' AND
		g2.gender = 'Male'
	GROUP BY g1.washroomId
),
GenderEqualityScore AS (
	SELECT g.washroomId,
	CASE
		WHEN g.diff <= 0 THEN 5
		WHEN g.diff >= f.washroomAvg THEN 1
		ELSE 1 + (4 * (f.washroomAvg - g.diff) / f.washroomAvg)
	END AS genderEqualityScore
	FROM GenderDiff g, FormWaitTimes f
	WHERE g.washroomId = f.washroomId
),
CleanlinessScore AS (
	SELECT f.washroomId, AVG(f.cleanliness) AS cleanlinessScore
	FROM Forms f
	GROUP BY f.washroomId
)
SELECT t.washroomId, 
    ((t.waitTimeScore + g.genderEqualityScore + c.cleanlinessScore) / 3)
        AS score,
    t.waitTimeScore,
    g.genderEqualityScore,
    c.cleanlinessScore
FROM WaitTimeScore t
JOIN GenderEqualityScore g ON t.washroomId = g.washroomId
JOIN CleanlinessScore c ON t.washroomId = c.washroomId;



SELECT * FROM Forms;

SELECT w.longitude, w.latitude FROM Washrooms w;

SELECT w.washroomName, w.category, w.onCall, w.street, w.openHour, w.closeHour, w.score
FROM Washrooms w WHERE w.washroomId = 1;

WITH avgWaitTimes AS (
	SELECT f.washroomId, f.gender, AVG(f.waitTime) AS avgWaitTime
	FROM Forms f
GROUP BY f.washroomId, f.gender)
SELECT avgWaitTime FROM avgWaitTimes WHERE washroomId = 1 AND gender = 'Female';

SELECT r.reviewTimestamp, r.text
    FROM Reviews r
    WHERE r.washroomId = 1
    ORDER BY r.reviewTimestamp DESC;

WITH openWashrooms AS 
	(SELECT washroomId 
	FROM Washrooms w
	WHERE w.openHour <= 6.5
		AND w.closeHour >= 6.5)
SELECT COUNT(*) AS isOpen FROM openWashrooms WHERE washroomId = 1;

WITH openWashrooms AS 
	(SELECT washroomId 
	FROM Washrooms w
	WHERE w.openHour <= 6.5
		AND w.closeHour >= 6.5)
SELECT COUNT(*) AS isOpen FROM openWashrooms WHERE washroomId = 2;