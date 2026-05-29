import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly config: Record<string, string | number> = {
    JWT_SECRET: 'mploychek-super-secret-jwt-key-2024-enterprise',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '7d',
    API_DELAY_MIN: 200,
    API_DELAY_MAX: 800,
    PORT: 3000,
    DB_PATH: 'db.json',
  };

  get jwtSecret(): string {
    return this.config['JWT_SECRET'] as string;
  }

  get jwtExpiresIn(): string {
    return this.config['JWT_EXPIRES_IN'] as string;
  }

  get jwtRefreshExpiresIn(): string {
    return this.config['JWT_REFRESH_EXPIRES_IN'] as string;
  }

  get apiDelayMin(): number {
    return this.config['API_DELAY_MIN'] as number;
  }

  get apiDelayMax(): number {
    return this.config['API_DELAY_MAX'] as number;
  }

  get port(): number {
    return this.config['PORT'] as number;
  }

  get dbPath(): string {
    return this.config['DB_PATH'] as string;
  }
}
