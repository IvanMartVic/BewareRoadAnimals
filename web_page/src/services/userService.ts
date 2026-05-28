"use server"
import { prisma } from "@/../lib/prisma";
import bcrypt from "bcryptjs";
import { verifyAuthResetToken, authAdmin } from "@/services/authenticationService";
import { assert } from "console";
// import { User } from "../../generated/prisma/client";

export interface InputUser {
    full_name: string,
    email: string,
    role: string,
    password: string,
}
// export type OutputUser = Omit<User, 'password_hash'>;
export interface OutputUser {
    id: number;
    email: string;
    full_name: string;
    createdAt: Date;        
    role: string;
    resetToken?: string | null;  
    tokenExpiry?: Date | null;   
}
export interface UpdateUserData {
    full_name: string,
    email: string,
    role: string,
}
export interface UpdateUserInput {
    id: number,
    new_data: Partial<UpdateUserData>,
}

export async function getAllUsers(filters = {}) {
    console.log(process.env.DATABASE_URL);
    const {success} = await authAdmin();
    if(!success){
        return;
    }
    const users = await prisma.user.findMany({
        where: { ...filters, },
    });
    // const response = await fetch("/api/users");
    // const users = await response.json();
    return users;
}

export async function getUserById(id: number) : Promise<OutputUser| null>  {
    const {success, userData} = await authAdmin();
    if(!success && userData?.userId != id){
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        }
    });
    return user;
}
export async function searchUsers(searchInput:string){
    const {success} = await authAdmin();
    if(!success){
        return;
    }
    const users = await prisma.user.findMany({
        where:{
            OR:[
                {full_name: { contains: searchInput, mode: "insensitive"}},
                {email: { contains: searchInput, mode: "insensitive"}},
            ],
        }
    });
    return users;
}
export async function getUserCount(filters = {}) {
    const {success} = await authAdmin();
    if(!success){
        return;
    }
    const count = await prisma.user.count({
        where: {
            ...filters,
        }
    });
    return count;
}

export async function createUser(userData: InputUser) {
    const {success} = await authAdmin();
    if(!success){
        return;
    }
    const { full_name, email, password, role: isAdmin } = userData;
    let role = undefined;
    if (isAdmin) {
        role = "ADMIN";
    }

    console.log(`añadiendo usuario ${full_name}`);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const new_user = await prisma.user.create({
        data: { full_name: full_name, email: email, password_hash: hash, role: role }
    });
    console.log(new_user);
    return new_user;
}

export async function deleteUser(id: number) {
    const {success, userData} = await authAdmin();
    if(!success && userData?.userId != id){
        return;
    }
    const user = await prisma.user.delete({
        where: {
            id: id,
        }
    });
    return user;
}

export async function updateUser({ id, new_data }: UpdateUserInput) {
    const {success, userData} = await authAdmin();
    if(!success && userData?.userId != id){
        return;
    }
    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: { ...new_data },
    });
    return user;

}
export async function changeUserPassword({new_password, resetToken} : {new_password:string, resetToken:string}){
    const {success, user} = await verifyAuthResetToken(resetToken);
    if(!success || !user){
        console.log("invalid resetToken tried to change password");
        return null;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);
    const updated_user = await prisma.user.update({
        where:{
            id: user.id,
        },
        data:{
            password_hash: hash,
            resetToken: null,
            tokenExpiry: null,
        }
    });
    assert(updated_user, "tried to change password to a unexisting user");
    return updated_user; 
}

