import { create } from "zustand";
import { getAllUsers, createUser , deleteUser, updateUser, getUserById, OutputUser, InputUser, UpdateUserInput} from "@/services/userService"


type userStoreState = {
    users: OutputUser[],
    isLoading: boolean,
    error: string | null,
};
type userStoreActions = {
    addUser: (newUser: InputUser) => void,

}
type UserStore = userStoreState & userStoreActions;



const useUserStore = create<UserStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,
    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const res = await getAllUsers();
            set({ users: res, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
    addUser: async (newUser: InputUser) => {
        try {
            const addedUser: OutputUser = await createUser(newUser);
            set((state) => ({ users: [...state.users, addedUser] }));
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    deleteUser: async (id: number) => {
        try {
            const deletedUser: OutputUser = await deleteUser(id);
            set((state) => ({
                users: state.users.filter((device) => device.id != id)
            }));
            return deletedUser;
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    updateUser: async ({ id, new_data }: UpdateUserInput) => {
        try {
            const updatedUser: OutputUser= await updateUser({ id, new_data});
            set((state) => ({
                users: state.users.map((device) => device.id == id ? updatedUser : device),
            }));

        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    getUserById: async (id:number) => {
        try{
            // we could cache this response with the array devices I think
            const selectedUser: OutputUser|null = await getUserById(id);
            if(!selectedUser){
                throw new Error(`device with id: ${id} not in db`);
            }
            return selectedUser;

        }catch(e){
            if(e instanceof Error){
                set({error:e.message});
            }
        }

    }
}));

export default useUserStore;
