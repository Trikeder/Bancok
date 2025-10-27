import express from 'express';
const app = express();
app.use(express.json());

app.post('/api/v1/wallets/transfer', (req, res) => {
  res.json({ success: true, message: 'Transfer endpoint' });
});

app.listen(3003, () => console.log('Wallets service running on port 3003'));