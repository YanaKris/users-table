import { makeAutoObservable, runInAction } from 'mobx';
import { getUsers } from '../api/usersApi';

export class UsersStore {
  users = [];
  total = 0;
  loading = true;
  error = null;
  limit = 30;
  skip = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    this.loading = true;
    this.error = null;
    try {
      const data = await getUsers({ limit: this.limit, skip: this.skip });
      runInAction(() => {
        this.users = data.users;
        this.total = data.total;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.users = [];
        this.total = 0;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  refetch() {
    return this.load();
  }
}

export const usersStore = new UsersStore();
