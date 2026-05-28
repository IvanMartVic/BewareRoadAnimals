import { create } from "zustand";
import { AuthTokenData } from "@/utils/auth"
import { auth, verifyAuthResetToken } from "@/services/authenticationService";
import { updateUser, OutputUser, UpdateUserData, UpdateUserInput, getUserById, deleteUser } from "@/services/userService";

type authStoreState = {
    authUserData: OutputUser | null,
    userId: number,
    error: string | null,
};

type authStoreActions = {
    fetchAuthUser: () => void,
    setAuthUserData: (newData: Partial<AuthTokenData>) => void,
    deleteAuthUser: () => void,
};
type AuthStore = authStoreState & authStoreActions;

const useAuthStore = create<AuthStore>((set, get) => ({
    authUserData: null,
    userId: 0,
    error: null,
    resetError: async() => {
        set({error: null});
    },
    fetchAuthUser: async () => {
        console.log("fetched called");
        try {
            const res = await auth();
            if (res?.success && res.userData?.userId) {
                const id = res.userData.userId;
                const userData = await getUserById(id);
                set({ authUserData: userData, userId: id });
            } else {
                throw new Error("Error, not a valid jwt");
            }
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message })
            }
        }
    },
    setAuthUserData: (newData: Partial<AuthTokenData>) => {

        set((state) => ({
            authUserData: state.authUserData ? {
                ...state.authUserData,
                ...newData,
            } : (newData as OutputUser)

        }));
        return;
    },
    updateAuthUser: async (fields: Partial<UpdateUserData>) => {
        try {
            const id = get().userId;
            if (!id) {
                throw new Error("Trying to update an undefined authUser (maybe use fetchAuthUser before calling updateAuthUser)")
            }
            const updatedUser: OutputUser = await updateUser({ id: id, new_data: fields });
            set((state) => ({
                authUserData: state.authUserData ? {
                    ...state.authUserData,
                    ...fields,
                } : (fields as OutputUser)

            }));

        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }

    },
    deleteAuthUser: async () => {
        try {
            const id = get().userId;
            if (!id) {
                throw new Error("Trying to update an undefined authUser (maybe use fetchAuthUser before calling updateAuthUser)")
            }
            const deletedUser: OutputUser = await deleteUser(id);
            set({ authUserData: null });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message })
            }
        }
    },
    fetchAuthUserFromResetToken: async (token: string) => {
        try {
            const response = await verifyAuthResetToken(token);
            if (!response.success || !response.user) {
                throw new Error("Error, not a valid token");
            }
            set({ authUserData: response.user, userId: response.user.id });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message })
            }
        }
    },
    resetPassword: async (password: string) => {
        try {
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message })
            }
        }
    }

}));

export default useAuthStore;
