import app from '@shared/infra/http/app';
import envs from '@config/environment';

app.listen(envs.PORT, () => console.log(`Server started on port ${envs.PORT}`));
