import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.PORT, (error) => {
    if (error) throw error;
    console.log(`Server is running on port ${env.PORT}`);
});