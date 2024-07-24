// src/routes/register/+page.server.ts

import type { Actions } from './$types';
import { db } from '$lib/db/db.server';
import { userTable } from '$lib/db/schema';
import { saltAndHashPassword } from '$lib/utils/password';
import { emailExists, registerUser } from '$lib/db/queries';

export const actions: Actions = {
  register: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password) {
      return {
        status: 400,
        body: { message: 'Email and password are required' }
      };
    }

    // Check if the email already exists
    let exists = await emailExists(email);
    if (exists) {
      return {
        status: 400,
        body: { message: 'Email already registered' }
      };
    }

    // Hash the password
    const hashedPassword = await saltAndHashPassword(password);

    // Save the user to the database
    registerUser(email, password, name);
    return {
      status: 201,
      body: { message: 'User registered successfully' }
    };
  }
};
