import express from 'express';
const app = express();
app.use(express.json());

app.get('/api/v1/transactions', (req, res) => {
  res.json({ success: true, message: 'Transactions endpoint' });
});

app.listen(3004, () => console.log('Transactions service running on port 3004'));