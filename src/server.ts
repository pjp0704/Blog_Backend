import app from './app';
import config from './config';

const { PORT } = config;

app.listen(PORT || 8080, () => {
  console.log('listening on port ' + (PORT || 8080));
});
