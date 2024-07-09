# CS-348-Course-Project

This project is a React Native application designed to help users find and rate public bathrooms. It includes a map interface, a form for submitting ratings, and a review section.

## Prerequisites

To create a sample database, please ensure that **MySQL** is installed before continuining with the following steps. Installing can be found at the [installation page](https://dev.mysql.com/doc/refman/8.0/en/installing.html).

## Main File Locations and Descriptions

#### Frontend Files (inside `pissd-off/app`)
- **`index.tsx`**:
  - The entry point of the application.
  - Manages navigation between the Map screen and the Form screen.
  - Handles location permissions and fetching the user's current location.

- **`MapScreen.tsx`**:
  - Displays the map with markers for nearby bathrooms.
  - Fetches bathroom coordinates from the backend.
  - Contains a button to navigate to the rating form.

- **`Form.tsx`**:
  - Allows users to submit ratings for cleanliness, gender, and wait times.
  - Starts and stops a timer to track wait times.
  - Sends rating data to the backend.

#### Backend File (inside `pissd-off`)
- **`test.php`**:
  - Backend script that handles requests for bathroom coordinates and ratings.
  - Connects to the SQL database to store and retrieve data.

#### SQL Files (inside `pissd-off/sql-files`)
- **`CreateScoreTrigger.sql`**:
  - Creates a SQL trigger called UpdateScoreAfterInsert.
  - Updates the score of a washroom in the Washrooms table whenever a new rating is inserted into the Forms table.
    
- **`CreateScoreView.sql`**:
  - Creates a view (virtual table) called WashroomScores.
  - Calculates overall scores for washrooms based on wait time, gender equality, and cleanliness.

## Database Setup

### Create and Load Sample Database

1. Make a new database by following the instructions provided below:

```mysql
$ mysql -u root -p (or sudo mysql -u root)
mysql> CREATE DATABASE pissd;
mysql> USE pissd;
```

2. Create Tables and populate with

  * sample data

```mysql
mysql> source sql-files/MakeEverything.sql
mysql> source sql-files/SamplePopulateData.sql
```
  * production data
    
```mysql
mysql> source sql-files/MakeEverything.sql
mysql> source sql-files/ProductionPopulateData.sql
```

## Running application

1. Install yarn 
2. Run `yarn install`
    - additional dependencies may need to be added
2. Run `yarn start` 
    - note it will not work when connected to the school wifi
4. Scan the QR code with the `Expo Go` app on your phone
