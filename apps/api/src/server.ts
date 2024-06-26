import { isCelebrateError } from 'celebrate';
import express, { Errback, Request, Response } from 'express';

import cors from 'cors';
import { router } from './routes';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(cors({ origin: '*' }));

app.use(router);

app.use((_req, res) => {
  res.status(404).send('Content not found');
});

app.use((err: Errback, _req: Request, res: Response) => {
  if (isCelebrateError(err)) {
    let message = err.message;
    if (Object.fromEntries(err.details).body) {
      message += ': ' + Object.fromEntries(err.details).body?.details[0]?.message;
    }
    return res.status(400).json({ error: message });
  } else {
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running in the port ${port}`);
});
