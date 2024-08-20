# DBAPI

DBAPI is a web application designed to simplify the process of creating and managing APIs for your database content. It allows users to easily add, edit, and store data in a structured manner, making it an ideal tool for developers looking to streamline their project workflows.

## Features

- **User Authentication**: Secure login and registration functionality to ensure that only authorized users can access and modify their APIs.
- **Dynamic API Management**: Users can create new databases (DBs), add content to them, and edit existing content with ease.
- **Image Upload**: Supports uploading images as part of the content, storing them in base64 format.
- **Framework Selection**: Allows users to specify the framework associated with each piece of content, facilitating integration with various development environments.
- **Badge System**: Users can assign badges to their content, enhancing organization and categorization.

## Getting Started

To get started with DBAPI, follow these steps:

1. **Install Dependencies**

Navigate to the project directory and install the necessary dependencies:

cd dbapi npm install


2. **Start the Backend Server**

Ensure MongoDB is running on your system. Then, start the backend server:

cd backend npm start


This will start the server on `http://localhost:2000`.

3. **Run the Frontend Application**

Open a new terminal window, navigate to the `app` directory, and start the frontend application:

cd app npm start


This will launch the application on `http://localhost:3000`.

## Usage

- **Register/Login**: Start by registering a new account or logging in with existing credentials.
- **Create DB**: Once logged in, you can create a new database by specifying a name for it.
- **Add Content**: Add new content to your database by filling out the form with the name, description, and selecting the appropriate framework. You can also upload images and assign badges to your content.
- **Edit Content**: Existing content can be edited or moved to a different framework as needed.

## Technologies

DBAPI is built using the following technologies:

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Custom implementation with email and password
- **Image Storage**: Images are stored in base64 format within MongoDB

## Contributing

Contributions are welcome! If you have any suggestions for new features or improvements, feel free to open an issue or submit a pull request.

## License

DBAPI is open-source software licensed under the MIT license.
