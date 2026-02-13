"use client"
import { getAllUsers } from "../../services/userService";
export default function usersMainPage(){
    const click = async () => {
        // fetch("/api/users");
        const users = await getAllUsers();
        alert(users);
    }
    return(
        <div><h1>usersMainPage</h1>
            <button className="btn btn-primary" onClick={click}> Jodeme la vida </button>

        </div>
    );

}
