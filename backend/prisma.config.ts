import { config } from 'dotenv';

config();

export default {
  adapter: new URL(process.env.DATABASE_URL || 'file:./dev.db'),
};
