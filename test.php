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
if ($_SERVER['REQUEST_URI'] === '/test.php/coordinates') {
    // Fetch data from MySQL database
    $sql = "SELECT w.washroomId, w.washroomName, w.latitude, w.longitude
            FROM Washrooms w
            ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Output data of each row
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        // Output JSON format
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo json_encode(array('message' => '0 results'));
    }
} 

else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/test.php/ratings') {
       // Read and decode JSON body sent by Axios
   $data = json_decode(file_get_contents("php://input"), true);
   // Assuming $data now holds the JSON-decoded body
   if ($data) {
       // Extract data from the received JSON
       $formTimestamp = $data['reviewTimestamp'];
       $gender = $data['gender'];
       $cleanliness = $data['cleanliness'];
       $waitTime = $data['waitTime'];

       // Print the received data
       echo "Received rating data:\n";
       echo "Form Timestamp: $formTimestamp\n";
       echo "Gender: $gender\n";
       echo "Cleanliness: $cleanliness\n";
       echo "Wait Time: $waitTime\n";

        $date = date('Y-m-d H:i:s'); // Convert string to date format.
       

        $getMaxFormId = "SELECT formId + 1 FROM Forms WHERE formId >= ALL(SELECT formId FROM Forms);";
        $formId = $conn->query($getMaxFormId);
        $intFormId = $formId->fetch_array()[0] ?? NULL;
        $insertForms = "INSERT INTO Forms (formId, waitTime, cleanliness, gender, formTimestamp)
                VALUES ($intFormId, $waitTime, $cleanliness, '{$gender}', '{$date}');";
        if ($conn->query($insertForms) === TRUE) {
            echo "New record inserted successfully";
        } else {
            echo "Error: " . $insertForms . "<br>" . $conn->error;
        }

        $insertisFormOf = "INSERT INTO isFormOf (washroomId, formId) VALUES (1, $intFormId);";
            if ($conn->query($insertisFormOf) === TRUE) {
                echo "New record inserted successfully";
            } else {
                echo "Error: " . $insertisFormOf . "<br>" . $conn->error;
            }

       // Optionally, you can send a response back to your React Native app
       $response = array('message' => 'Rating data received successfully');
       echo json_encode($response);
   } else {
       // Handle case where JSON decoding failed
       http_response_code(400);
       echo "Failed to decode JSON.";
   }
}

else {
    // Invalid endpoint
    http_response_code(404);
    echo json_encode(array('message' => 'Endpoint not found'));
}

$conn->close();
?>
