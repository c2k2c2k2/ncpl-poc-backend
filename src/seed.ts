import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);

  // Example initial users
  const users = [
    {
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'alice_doc',
      email: 'alice.smith@hospital.com',
      password: 'StrongPass123!',
      role: 'doctor',
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      username: 'bob_nurse',
      email: 'bob.johnson@hospital.com',
      password: 'StrongPass123!',
      role: 'nurse',
    },
    {
      firstName: 'Carol',
      lastName: 'Admin',
      username: 'carol_admin',
      email: 'carol.admin@hospital.com',
      password: 'StrongPass123!',
      role: 'admin',
    },
  ];

  for (const user of users) {
    try {
      // Use await correctly
      await userService.create(user as any).catch((error) => {
        console.error(`Error creating ${user.username}:`, error.message);
      });
      console.log(`User ${user.username} created.`);
    } catch (error) {
      console.error(`Error creating ${user.username}:`, error.message);
    }
  }

  await app.close();
}

seed();
