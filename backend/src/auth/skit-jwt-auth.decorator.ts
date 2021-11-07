import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_AUTH_KEY = 'skipJwtAuth';
export const SkipJwt = () => SetMetadata(SKIP_JWT_AUTH_KEY, true);
