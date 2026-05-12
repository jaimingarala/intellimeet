const app = require('./app');

const PORT = Number(process.env.API_PORT || 4000);

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
