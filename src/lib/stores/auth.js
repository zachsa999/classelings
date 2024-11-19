import { writable, derived } from 'svelte/store';

function createAuthStore() {
    const { subscribe, set, update } = writable({
        user: null,
        isAuthenticated: false
    });

    return {
        subscribe,
        setUser: (userData) => {
            set({
                user: userData,
                isAuthenticated: !!userData
            });
        },
        clearUser: () => {
            set({
                user: null,
                isAuthenticated: false
            });
        }
    };
}

export const auth = createAuthStore();

// Derived stores for convenience
export const user = derived(auth, $auth => $auth.user);
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated); 