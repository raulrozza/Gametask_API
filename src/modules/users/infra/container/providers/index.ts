import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import ITokenProvider from './TokenProvider/models/ITokenProvider';
import JwtTokenProvider from './TokenProvider/implementations/JwtTokenProvider';
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JwtTokenProvider);
