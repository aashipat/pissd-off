# Relief Route 📍

Relief Route is like Google Maps for bathrooms. Built with React Native, the app helps users locate, review, and rate public bathrooms in real time. It features an interactive map with two viewing modes, user-submitted ratings, average wait times, and more to improve accessibility and decision-making while on the go!

## Demo

### Features - Locations and Ratings

<img width="750" height="400" alt="Screenshot 2026-01-16 at 9 51 23 AM" src="https://github.com/user-attachments/assets/ce5ba16c-7af2-4db2-9d60-15a6f99fc903" />

### Features - Average Wait Times, Reviews and more

<img width="750" height="400" alt="Screenshot 2026-01-16 at 9 53 28 AM" src="https://github.com/user-attachments/assets/2ad4a0f0-927a-40d0-9a6e-954e717522de" />

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
