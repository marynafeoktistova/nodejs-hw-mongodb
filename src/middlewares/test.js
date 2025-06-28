import jwt from 'jsonwebtoken';

const token = '7q4JgX1lXr2K9K9w7qZzNf0KsGhLqEjf';
const secret = '7q4JgX1lXr2K9K9w7qZzNf0KsGhLqEjf';

try {
  const decoded = jwt.verify(token, secret);
  console.log('Token is valid:', decoded);
} catch (error) {
  console.error('Invalid token:', error.message);
}
