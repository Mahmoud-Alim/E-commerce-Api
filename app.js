require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => require('fs').appendFileSync('error.log', message) } }));
}

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));