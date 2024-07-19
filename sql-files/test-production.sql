SELECT * FROM Forms;

SELECT w.washroomId, w.longitude, w.latitude, w.washroomName, w.category, w.onCall, w.street, w.openHour, w.closeHour, w.score FROM Washrooms w;

WITH avgWaitTimes AS (
	SELECT f.washroomId, f.gender, AVG(f.waitTime) AS avgWaitTime
	FROM Forms f
    GROUP BY f.washroomId, f.gender
)
SELECT gender, avgWaitTime FROM avgWaitTimes WHERE washroomId = 1;

WITH avgWaitTimes AS (
	SELECT f.washroomId, f.gender, AVG(f.waitTime) AS avgWaitTime
	FROM Forms f
    GROUP BY f.washroomId, f.gender
)
SELECT gender, avgWaitTime FROM avgWaitTimes WHERE washroomId = 2249;

SELECT r.reviewTimestamp, r.text
    FROM Reviews r
    WHERE r.washroomId = 1
    ORDER BY r.reviewTimestamp DESC;

SELECT
   w.washroomId,
   CASE
       WHEN w.openHour <= 6.5
            AND w.closeHour >= 6.5 THEN 1
       WHEN w.openHour IS NULL OR w.closeHour IS NULL THEN 1
       ELSE 0
   END AS isOpen
   FROM Washrooms w;

SELECT
	CASE
		WHEN w.openHour <= 6.5
				AND w.closeHour >= 6.5 THEN 1
		WHEN w.openHour IS NULL OR w.closeHour IS NULL THEN 1
		ELSE 0
	END AS isOpen
	FROM Washrooms w
	WHERE w.washroomId = 1;

SELECT
	CASE
		WHEN w.openHour <= 6.5
				AND w.closeHour >= 6.5 THEN 1
		WHEN w.openHour IS NULL OR w.closeHour IS NULL THEN 1
		ELSE 0
	END AS isOpen
	FROM Washrooms w
	WHERE w.washroomId = 2882;

SELECT * FROM WashroomScores
