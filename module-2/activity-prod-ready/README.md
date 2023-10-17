### Step 1: Setting up your project

1. Create a new directory for your project and navigate into it via your terminal or command line.

    ```bash
    mkdir my-online-store
    cd my-online-store
    ```

2. Once inside the project directory, initialize a new Node.js project.

    ```bash
    npm init -y
    ```

3. Now install the necessary packages.

    ```bash
    npm install express mongoose winston express-validator morgan swagger-ui-express yamljs
    ```

### Step 2: Project Structure

Create the following file structure inside your project directory. You can do this using the command line or manually in your file explorer.

- `/my-online-store`
  - `/node_modules`
  - `/models`
    - `product.js`
  - `/routes`
    - `productRoutes.js`
  - `/middleware`
    - `loggerMiddleware.js`
    - `errorMiddleware.js`
    - `validatorMiddleware.js`
  - `/config`
    - `winston-config.js`
    - `db.js`
  - `app.js`
  - `package.json`
  - `/docs`
    - `swagger.yaml`

### Step 3: Filling in the files

Here's what each of your project files will include (based on our previous discussions):

1. **models/product.js**: Contains the Mongoose schema for your products.

2. **routes/productRoutes.js**: Handles the product-related routes.

3. **middleware/loggerMiddleware.js**: Contains the Winston logger middleware.

4. **middleware/errorMiddleware.js**: Handles errors from your application.

5. **middleware/validatorMiddleware.js**: Validates requests using `express-validator`.

6. **config/winston-config.js**: Contains the Winston logging configuration.

7. **config/db.js**: Manages the connection to your MongoDB database.

8. **app.js**: Your main application file, setting up your Express.js server.

9. **docs/swagger.yaml**: The OpenAPI documentation for your API.

### Step 4: Implementing Code

Certainly, I'll guide you through the creation of the code in detail, respecting best practices for a production environment. This will be a lengthy process due to the multiple parts of the project, but I'll make it as clear as possible.

For simplicity, I will not create a full-fledged authentication system or deep business logic but will focus on structuring the application with validation, sanitization, error handling, and logging.

1. **Setting up environment variables:**

    Create a `.env` file in the root of your project to keep your environment variables. We'll start with the database URL.

    ```
    # .env file
    MONGO_URI=mongodb://localhost:27017/my-online-store
    PORT=3000
    ```

    Don't forget to add `.env` to your `.gitignore` file to avoid pushing sensitive information to public repositories.

2. **Connecting to the Database:**

    - `/config/db.js`

    ```javascript
    const mongoose = require('mongoose');
    const logger = require('../config/winston-config');

    const connectDB = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
            logger.info('MongoDB connected...');
        } catch (err) {
            logger.error('Database connection error', err);
            process.exit(1);
        }
    };

    module.exports = connectDB;
    ```

3. **Setting up the Winston Logger Configuration:**

    - `/config/winston-config.js`

    ```javascript
    const { createLogger, format, transports } = require('winston');

    const logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        ),
        defaultMeta: { service: 'user-service' },
        transports: [
            new transports.File({ filename: 'error.log', level: 'error' }),
            new transports.File({ filename: 'combined.log' })
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: format.simple(),
        }));
    }

    module.exports = logger;
    ```

4. **Creating the Product Model:**

    - `/models/product.js`

    ```javascript
    const mongoose = require('mongoose');

    const productSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        countInStock: {
            type: Number,
            required: true
        }
    });

    const Product = mongoose.model('Product', productSchema);
    module.exports = Product;
    ```

5. **Creating Logger, Validator, and Error Handling Middleware:**

    - `/middleware/loggerMiddleware.js`

    ```javascript
    const logger = require('../config/winston-config');

    const loggerMiddleware = (req, res, next) => {
        logger.info(`Handled ${req.method} request from ${req.originalUrl}`);
        next();
    };

    module.exports = loggerMiddleware;
    ```

    - `/middleware/errorMiddleware.js`

    ```javascript
    const logger = require('../config/winston-config');

    const handleError = (err, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode);
        res.json({
            message: err.message,
            stackTrace: process.env.NODE_ENV === 'production' ? null : err.stack
        });

        logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    };

    module.exports = handleError;
    ```

    - `/middleware/validatorMiddleware.js`

    ```javascript
    const { validationResult } = require('express-validator');

    const validateRules = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    };

    module.exports = validateRules;
    ```

6. **Setting up the Routes for Products:**

    - `/routes/productRoutes.js`

    ```javascript
    const express = require('express');
    const { body } = require('express-validator');
    const Product = require('../models/product');
    const validateRules = require('../middleware/validatorMiddleware');
    const router = express.Router();

    // Validation rules
    const productValidationRules = [
        body('name').trim().isLength({ min: 3 }),
        body('description').trim().isLength({ min: 5 }),
        body('price').isFloat({ gt: 0 }),
        body('countInStock').isInt({ gt: 0 })
    ];

    // CREATE a new product
    router.post('/', productValidationRules, validateRules, async (req, res, next) => {
        try {
            const product = new Product(req.body);
            const createdProduct = await product.save();
            res.status(201).json(createdProduct);
        } catch (error) {
            next(error); // Forward the error to the error handling middleware
        }
    });

    // Other CRUD endpoints...

    module.exports = router;
    ```

7. **The Main Server File:**

    - `app.js`

    ```javascript
    require('dotenv').config();
    const express = require('express');
    const productRoutes = require('./routes/productRoutes');
    const connectDB = require('./config/db');
    const handleError = require('./middleware/errorMiddleware');
    const loggerMiddleware = require('./middleware/loggerMiddleware');

    const app = express();

    // Connect to database
    connectDB();

    app.use(express.json());

    // Implementing the logger middleware
    app.use(loggerMiddleware);

    // Routes
    app.use('/api/products', productRoutes);

    // Error handling middleware
    app.use(handleError);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
    ```

This structured approach ensures a clean, maintainable, and scalable codebase. Each piece of functionality is clearly separated, and the code is ready for further expansion. Additionally, using environment variables and logger instances protects sensitive information and creates a sustainable logging mechanism for your production environment.


### Step 5: Running the Server

1. Once you've set up everything, start your server by running:

    ```bash
    node app.js
    ```

2. Your server should start, and it should connect to MongoDB. You can now try sending requests to your API endpoints and see the logging in action, validation working, and CRUD operations happening as expected.


