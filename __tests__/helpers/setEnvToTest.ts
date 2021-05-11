type EnvOptions = 'development' | 'production' | 'test';

export const setEnvToTest = (): EnvOptions => {
  const OLD_ENV = process.env.NODE_ENV as EnvOptions;

  process.env = {
    ...process.env,
    NODE_ENV: 'test',
  };

  return OLD_ENV;
};
