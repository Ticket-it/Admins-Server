/**
 * Requires
 */
const express = require('express')
require("dotenv").config();
const morgan = require('morgan')
var cors = require("cors");
const adminRouter = require("./routes/admin.router")
const errorHandler = require("./middlewares/errorHandler");

/**
 * Instances
 */
const app = express()
const ADMIN_ROUTER = "/api/admin"
const port = process.env.PORT || 3001;

/**
 * Middlewares
 */

// Logging
//app.use(morgan('combined'))
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// Error Handler
app.use(errorHandler)


/**
 * Routes
 */
app.use(ADMIN_ROUTER,adminRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Admins' Server listening on port ${port}`)
})