"use server"
import { prisma } from "@/../lib/prisma";
import bcrypt from "bcryptjs";

export async function getAllUsers() {
    const users = await prisma.user.findMany();
    // const response = await fetch("/api/users");
    // const users = await response.json();
    return users;
}

export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        }
    });
    return user;
}

export async function createUser(userData) {
    const { full_name, email, password, isAdmin } = userData;
    let role = undefined;
    if(isAdmin){
        role = "ADMIN";
    }

    console.log(`añadiendo usuario ${full_name}`);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const new_user = await prisma.user.create({
        data: { full_name: full_name, email: email, password_hash: hash , role:role }
    });
    console.log(new_user);
    return new_user;
}

export async function deleteUser(id) {
    const user = await prisma.user.delete({
        where: {
            id: id,
        }
    });
    return user;
}

export async function updateUser({id, new_data}){
    if(!id){
        return null;
    }
    const user = await prisma.user.update({
        where: {
            id:id,
        },
        data: new_data,
    });
    return user;

}

