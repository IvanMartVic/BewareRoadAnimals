"use server"
import { prisma } from "@/../lib/prisma";
import bcrypt from "bcryptjs";

export interface InputUser {
    full_name: string,
    email: string,
    role: string,
    password: string,
}
export interface OutputUser {
    id: number,
    full_name: string,
    email: string,
    role: string,
    created_at?: Date,
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

export async function getAllUsers() {
    console.log(process.env.DATABASE_URL);
    const users = await prisma.user.findMany();
    // const response = await fetch("/api/users");
    // const users = await response.json();
    return users;
}

export async function getUserById(id: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        }
    });
    return user;
}
export async function getUserCount(filters = {}){
    const count = await prisma.user.count({
        where:{
            ...filters,
        }
    });
    return count;
}

export async function createUser(userData: InputUser) {
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
    const user = await prisma.user.delete({
        where: {
            id: id,
        }
    });
    return user;
}

export async function updateUser({ id, new_data }: UpdateUserInput) {

    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {...new_data},
    });
    return user;

}

