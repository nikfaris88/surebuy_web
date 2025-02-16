import { defineStore } from 'pinia';

interface User {
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    login(email: string) {
      this.user = { email };
    },
    logout() {
      this.user = null;
    },
  },
});
