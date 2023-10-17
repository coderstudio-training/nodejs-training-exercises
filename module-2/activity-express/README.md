Here's a step-by-step guide for building a RESTful API with Express.js that covers the anatomy of a REST API, HTTP headers, request body, response body, status codes, and CRUD (Create, Read, Update, Delete) operations. This guide will use a simple "tasks" API as an example.

**Step 1: Set Up Your Environment**

Ensure you have Node.js and npm installed. You can download and install them from the official website if needed: [Node.js Downloads](https://nodejs.org/en/download/).

**Step 2: Create a New Project Directory**

Create a new directory for your project and navigate to it in your terminal.

```bash
mkdir express-rest-api
cd express-rest-api
```

**Step 3: Initialize a Node.js Project**

Run the following command to initialize a new Node.js project and follow the prompts.

```bash
npm init
```

**Step 4: Install Express.js**

Install Express.js as a project dependency.

```bash
npm install express --save
```

**Step 5: Create Your Express App**

Create an `app.js` file and set up your Express application.

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Sample data (to simulate a database)
let tasks = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
];

// Routes for CRUD operations
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTask = req.body;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks[index] = updatedTask;
  res.status(200).json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

**Step 6: Run Your Express App**

Start your Express server:

```bash
node app.js
```

Your RESTful API should now be running at `http://localhost:3000`.

**Step 7: Test Your API**

You can use tools like Postman or cURL to test your API endpoints for CRUD operations:

- GET `/tasks`: Retrieve a list of tasks.
- GET `/tasks/:id`: Retrieve a specific task by its ID.
- POST `/tasks`: Create a new task (provide JSON data in the request body).
- PUT `/tasks/:id`: Update an existing task by its ID (provide JSON data in the request body).
- DELETE `/tasks/:id`: Delete a task by its ID.

Test different scenarios, including successful requests and error handling, to understand how your API behaves.

**Step 8: Review HTTP Headers, Request Body, Response Body, and Status Codes**

- **HTTP Headers**: Use tools like Postman to inspect the headers in both the request and response. Note the content-type, status codes, and any other relevant headers.

- **Request Body**: When testing POST and PUT requests, examine how request bodies are sent as JSON data.

- **Response Body**: Check the response bodies to ensure they match the expected data format (usually JSON in a RESTful API).

- **Status Codes**: Pay attention to the HTTP status codes returned in the responses. They indicate the success or failure of the requests (e.g., 200 for success, 404 for not found, 201 for created, 204 for no content).

