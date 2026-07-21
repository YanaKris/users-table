import { makeAutoObservable, runInAction } from 'mobx';
import { getUsers } from '../api/usersApi';
import { ORDER } from '../constants/sort';

export class UsersStore {
  users = [];
  total = 0;
  loading = true;
  error = null;
  limit = 30;
  skip = 0;
  sortBy = null;
  order = null;
  lastRequestId = 0;

  constructor() {
    makeAutoObservable(this, { lastRequestId: false });
  }

  get isInitialLoading() {
    return this.loading && this.users.length === 0;
  }

  async load() {
    const requestId = ++this.lastRequestId;
    this.loading = true;
    this.error = null;
    try {
      const data = await getUsers({
        limit: this.limit,
        skip: this.skip,
        sortBy: this.sortBy,
        order: this.order,
      });
      if (requestId !== this.lastRequestId) return;
      runInAction(() => {
        this.users = data.users;
        this.total = data.total;
      });
    } catch (err) {
      if (requestId !== this.lastRequestId) return;
      runInAction(() => {
        this.error = err.message;
        this.users = [];
        this.total = 0;
      });
    } finally {
      if (requestId === this.lastRequestId) {
        runInAction(() => {
          this.loading = false;
        });
      }
    }
  }

  setSort(field) {
    if (this.sortBy !== field) {
      this.sortBy = field;
      this.order = ORDER.ASC;
    } else if (this.order === ORDER.ASC) {
      this.order = ORDER.DESC;
    } else {
      this.sortBy = null;
      this.order = null;
    }
    this.load();
  }

  refetch() {
    return this.load();
  }
}

export const usersStore = new UsersStore();
