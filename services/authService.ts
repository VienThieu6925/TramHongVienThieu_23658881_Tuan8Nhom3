export const authService = {
    login: async ({ email }: { email: string; password: string }) => {
      await new Promise((r) => setTimeout(r, 800));
      return { token: 'fake-token', user: { id: '1', email } };
    },
    register: async ({ email }: { email: string; password: string }) => {
      await new Promise((r) => setTimeout(r, 800));
      return { token: 'fake-token', user: { id: '1', email } };
    },
  };