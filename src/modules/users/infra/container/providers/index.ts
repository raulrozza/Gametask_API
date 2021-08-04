import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ITokenProvider from '@modules/users/domain/providers/ITokenProvider';

import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import JwtTokenProvider from './JwtTokenProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JwtTokenProvider);
