<?php
// Connect to MySQL database
$servername = "127.0.0.1";
$username = "kiran";
$password = "Bubble808";
$dbname = "WashroomDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the request is for /coordinates endpoint
if ($_SERVER['REQUEST_URI'] === '/test.php/washroomData') {
    // Fetch data from MySQL database
    $sql = "SELECT w.washroomId, w.washroomName, w.category, w.onCall, w.openHour, w.closeHour, w.score, w.latitude, w.longitude FROM Washrooms w";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Output data of each row
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        // Output JSON format
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo json_encode(array('message' => '0 results'));
    }
} else if ($_SERVER['REQUEST_URI'] === '/test.php/openWashrooms') {
    $date = date('H'); // Convert string to date format.
    // Fetch data from MySQL database
    $sql = "SELECT w.washroomId, CASE WHEN w.openHour <= $date AND w.closeHour >= $date THEN 1 WHEN w.openHour IS NULL OR w.closeHour IS NULL THEN 1 ELSE 0 END AS isOpen FROM Washrooms w;";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Output data of each row
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        // Output JSON format
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo json_encode(array('message' => '0 results'));
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/test.php/ratings') {
    // Read and decode JSON body sent by Axios
    $data = json_decode(file_get_contents("php://input"), true);
    // Assuming $data now holds the JSON-decoded body
    if ($data) {
        // Extract data from the received JSON
        $formTimestamp = $data['reviewTimestamp'];
        $gender = $data['gender'];
        $cleanliness = $data['cleanliness'];
        $waitTime = $data['waitTime'];
        $washroomId = $data['washroomId'];

        // Print the received data
        echo "Received rating data:\n";
        echo "Form Timestamp: $formTimestamp\n";
        echo "Gender: $gender\n";
        echo "Cleanliness: $cleanliness\n";
        echo "Wait Time: $waitTime\n";
        echo "WashroomId: $washroomId\n";

        $date = date('Y-m-d H:i:s'); // Convert string to date format.

        // Retrieve the next formId
        $getMaxFormId = "SELECT COALESCE(MAX(formId) + 1, 1) AS nextFormId FROM Forms";
        $result = $conn->query($getMaxFormId);

        if ($result) {
            $row = $result->fetch_assoc();
            $intFormId = $row['nextFormId'];

            // Prepare SQL statement for inserting into Forms table
            $insertForms = "INSERT INTO Forms (washroomId, formId, waitTime, cleanliness, gender, formTimestamp) VALUES ($washroomId, $intFormId, $waitTime, " . ($cleanliness !== null ? $cleanliness : "NULL") . ", '{$gender}', '{$date}')";
            if ($conn->query($insertForms) === TRUE) {
                echo "New record inserted successfully";
            } else {
                echo "Error: " . $insertForms . "<br>" . $conn->error;
            }
        } else {
            echo "Error retrieving next formId: " . $conn->error;
        }

        // Optionally, you can send a response back to your React Native app
        $response = array('message' => 'Rating data received successfully');
        echo json_encode($response);
    } else {
        // Handle case where JSON decoding failed
        http_response_code(400);
        echo "Failed to decode JSON.";
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/test.php/reviews') {
    // Read and decode JSON body sent by Axios
    $data = json_decode(file_get_contents("php://input"), true);
    // Assuming $data now holds the JSON-decoded body
    if ($data) {
        // Extract data from the received JSON
        $text = $data['text'];
        $washroomId = $data['washroomId'];

        // Print the received data
        echo "Received review data:\n";
        echo "Text: $text\n";
        echo "WashroomId: $washroomId\n";

        $date = date('Y-m-d H:i:s'); // Convert string to date format.

        // Retrieve the next formId
        $getMaxReviewId = "SELECT COALESCE(MAX(reviewId) + 1, 1) AS nextReviewId FROM Reviews";
        $result = $conn->query($getMaxReviewId);

        if ($result) {
            $row = $result->fetch_assoc();
            $intReviewId = $row['nextReviewId'];

            // Prepare SQL statement for inserting into Forms table
            $insertReviews = "INSERT INTO Reviews (washroomId, reviewId, text, reviewTimestamp) VALUES ($washroomId, $intReviewId, '{$text}', '{$date}')";
            if ($conn->query($insertReviews) === TRUE) {
                echo "New record inserted successfully";
            } else {
                echo "Error: " . $insertReviews . "<br>" . $conn->error;
            }
        } else {
            echo "Error retrieving next reviewId: " . $conn->error;
        }

        // Optionally, you can send a response back to your React Native app
        $response = array('message' => 'Review data received successfully');
        echo json_encode($response);
    } else {
        // Handle case where JSON decoding failed
        http_response_code(400);
        echo "Failed to decode JSON.";
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], '/reviews') !== false) {
    // Check if the washroomID parameter is present in the query string
    if (isset($_GET['washroomId'])) {
        $washroomId = $_GET['washroomId'];
        // Fetch data from MySQL database
        $sql = "SELECT r.text FROM Reviews r WHERE r.washroomId = $washroomId ORDER BY r.reviewTimestamp DESC";
        
        $result = $conn->query($sql);

            // Output data of each row
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            // Output JSON format
            header('Content-Type: application/json');
            echo json_encode($data);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], '/avgWaitTime') !== false) {
    // Check if the washroomID parameter is present in the query string
    if (isset($_GET['washroomId'])) {
        $washroomId = $_GET['washroomId'];
        // Fetch data from MySQL database
        $sql = "WITH avgWaitTimes AS (SELECT f.washroomId, f.gender, AVG(f.waitTime) AS avgWaitTime FROM Forms f GROUP BY f.washroomId, f.gender) SELECT gender, avgWaitTime FROM avgWaitTimes WHERE washroomId = $washroomId";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Output data of each row
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            // Output JSON format
            header('Content-Type: application/json');
            echo json_encode($data);
        }
    }
} else {
    // Invalid endpoint
    http_response_code(404);
    echo json_encode(array('message' => 'Endpoint not found'));
}

$conn->close();
?>
