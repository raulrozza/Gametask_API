import app from '@shared/infra/http/app';
import config from '@config/environment';

app.listen(config.PORT, () =>
  console.log(`Server started on port ${config.PORT}`),
);
