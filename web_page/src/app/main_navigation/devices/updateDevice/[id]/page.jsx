// import { useState, use, useEffect } from "react";
import { getUserById } from "@/services/userService";
import UserUpdateForm from "@/components/userUpdateForm";
// import { useRouter } from "next/navigation";
import useDeviceStore from "@/stores/deviceStore"

export default async function DeviceUpdatePage({params}){
    // const {userId} = use(params);
    // const [user, setUser] = useState(null);
    // const router = useRouter();
    // useEffect(() => {
    //     getUserById(+userId).then((user)=> setUser(user));
    //     // alert(JSON.stringify(user));
    // }, [userId]);
    const {id:deviceId} = params;
    const { getDeviceById, updateDevice } = useDeviceStore((state) =>({
        getDeviceById:state.getDeviceById,
        updateDevice:state.updateDevice,
    }))
    const user = await getUserById(+userId);
    console.log(JSON.stringify(user));
    return (
    <div className="flex justify-center items-center h-screen">
            {user && <UserUpdateForm key={user.id} user={user} submitRoute={"/users"}></UserUpdateForm>}
    </div>
    );


    

}
