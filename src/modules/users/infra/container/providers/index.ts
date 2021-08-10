import { container } from 'tsyringe';

import IHashProvider from '@modules/users/domain/providers/IHashProvider';
import ITokenProvider from '@modules/users/domain/providers/ITokenProvider';

import BCryptHashProvider from './BCryptHashProvider';
import JwtTokenProvider from './JwtTokenProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JwtTokenProvider);
