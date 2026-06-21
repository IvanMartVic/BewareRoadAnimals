import { getUserById } from "@/services/userService";
import UserUpdateForm from "@/components/userUpdateForm";


export default async function UserUpdatePage({ params }) {
    const { userId } = await params;
    const user = await getUserById(+userId);
    console.log(JSON.stringify(user));
    return (
        <div className="flex justify-center items-center h-screen">
            {user && <UserUpdateForm key={user.id} user={user} submitRoute={"/main_navigation/users"}></UserUpdateForm>}
        </div>
    );




}
