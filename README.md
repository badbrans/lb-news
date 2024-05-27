# VRP Creative - Newspaper Script for lb-phone

This repository contains a newspaper script adapted for VRP Creative, specifically for use with the `lb-phone` application. The script provides functionality to create, edit, and delete news articles, accessible only to users with the appropriate permissions set in the `config.lua` file.

## Features

- **Create News:** Users with the required permissions can create news articles.
- **Edit News:** Users can edit existing news articles.
- **Delete News:** Users can delete news articles.
- **Database Integration:** Includes an accompanying `.SQL` file to set up the necessary database structure.


Import the SQL File:
Import the newspaper.sql file into your database to set up the necessary tables.

Configure Permissions:
Open the config.lua file and define the permissions for users who can create, edit, and delete news articles.

Add to Your Server:
Add the script to your server's resource folder and ensure it is included in your server's resource start list.

Configuration
The config.lua file allows you to set user permissions for managing news articles. Ensure that you define the appropriate roles or identifiers that can access these functionalities.

Usage
Once installed and configured, users with the defined permissions can access the newspaper script through the lb-phone app. They will be able to create, edit, and delete news articles directly from their interface.

Contributing
If you wish to contribute to this project, please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the existing style and conventions.

Contact
For any questions or support, please open an issue on this repository.
