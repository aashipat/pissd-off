DELIMITER $$

CREATE TRIGGER UpdateScoreAfterInsert
AFTER INSERT ON Forms
FOR EACH ROW
BEGIN
    UPDATE Washrooms w
    SET w.score = (SELECT ws.score FROM WashroomScores ws WHERE ws.washroomId = NEW.washroomId)
    WHERE w.washroomId = NEW.washroomId;
END$$

DELIMITER ;