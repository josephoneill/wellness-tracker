import { addUser, getUser } from '@/api/user/userApi';

class UserClient {
  public async createUser(
    firstName: string,
    lastName: string
  ) {
    if (!firstName || !lastName) {
      console.warn('Cannot find user\'s name');
    }
    await addUser(firstName, lastName);
  }

  public async getUser() {
    return getUser();
  }
}

export const userClient = new UserClient();