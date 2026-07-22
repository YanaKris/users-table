import { makeAutoObservable, observable, runInAction } from 'mobx';
import { getUsers, searchUsers } from '../api/usersApi';
import { ORDER } from '../constants/sort';

export class UsersStore {
  users = [];
  total = 0;
  loading = true;
  error = null;
  limit = 30;
  page = 1;
  sortBy = null;
  order = null;
  search = '';
  selectedUser = null;
  lastRequestId = 0;

  constructor() {
    makeAutoObservable(this, { lastRequestId: false, selectedUser: observable.ref });
  }

  get isInitialLoading() {
    return this.loading && this.users.length === 0;
  }

  get skip() {
    return (this.page - 1) * this.limit;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  async load() {
    const requestId = ++this.lastRequestId;
    this.loading = true;
    this.error = null;
    try {
      const params = {
        limit: this.limit,
        skip: this.skip,
        sortBy: this.sortBy,
        order: this.order,
      };
      const data = this.search
        ? await searchUsers({ q: this.search, ...params })
        : await getUsers(params);
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
    this.page = 1;
    this.load();
  }

  setPage(page) {
    this.page = Math.min(Math.max(1, page), this.totalPages);
    this.load();
  }

  setSearch(query) {
    this.search = query;
    this.page = 1;
    this.load();
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  clearSelection() {
    this.selectedUser = null;
  }

  refetch() {
    return this.load();
  }
}

export const usersStore = new UsersStore();
