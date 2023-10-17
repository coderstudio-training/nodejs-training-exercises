# Bad Bookstore API

**WARNING:** This is an educational project that demonstrates what NOT to do when creating a Node.js API. The project intentionally contains multiple critical flaws.

The Bad Bookstore API is an example of an improperly implemented Express.js application that showcases common mistakes made during development, lacking security, error handling, proper architecture, and more.

## Disclaimer

This project is purposely filled with bad practices and security flaws and should not, under any circumstances, be used as a production application. The sole purpose of the Bad Bookstore API is to serve as a learning tool for what to avoid when developing real-world applications.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have Node.js and MongoDB installed on your local machine. This project was created with Node.js version 14.x and MongoDB version 4.x.

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/user/bad-bookstore-api.git
   ```
   
2. Navigate to the project directory:
   ```bash
   cd bad-bookstore-api
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node server.js
   ```

The server will start on port 3000 by default (http://localhost:3000/).

## Usage

Here are the available endpoints:

- **POST /books**: Add a new book. It accepts JSON with `title`, `author`, `summary`, and `price` fields.
- **GET /books**: Retrieve all books. No pagination, you will get everything.
- **PUT /books/:id**: Update the book with the specified ID. JSON body is similar to the POST route.
- **DELETE /books/:id**: Deletes the book with the specified ID.

Remember, none of these routes are secure, handle errors properly, or are optimized for performance.

## Contributing

Any contributions you make are **greatly appreciated**, especially if they introduce even more flaws, making the project more educational.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - your@email.com

Project Link: [https://github.com/your_username/bad-bookstore-api](https://github.com/your_username/bad-bookstore-api)

