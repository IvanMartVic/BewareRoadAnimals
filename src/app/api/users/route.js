// import { prisma } from "@/../lib/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// tengo serias sospechas sobre la conveniencia de tener una api ._.
export async function GET(){
    // const users = await prisma.user.findMany();
    // return NextResponse.json(users);
    console.log("hola mundo");
    return NextResponse.json({message:"hola pringao"});

}
// console.log("el hijooo putaa entraaa");
// const {full_name, email, password} = await request.json();
// console.log('añadiendo usuario ${full_name}');
// const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS);
// const new_user = await prisma.user.create({
//     data:{full_name:full_name, email:email, password_hash:hash}
// });
// console.log(new_user);
// return NextResponse.json(new_user);
export async function POST(request){
    console.log("hola mundo");
    return NextResponse.json({message:"hola pringao"});
}
