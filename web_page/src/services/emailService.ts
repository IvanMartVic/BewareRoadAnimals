"use client"
// import { emailServiceResponse } from "@/app/api/send_password_email/route";
import { ErrorResponse } from "resend";
export async function resetPassword(email: string) {
    try {
        const response = await fetch('/api/send_password_email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
            }),
        })
        let error = "";
        if (!response.ok) {
            error = 'Error al enviar email de confirmación';
            console.error(error);
            const data = (await response.json()); 
            if(data.error){
                console.error(JSON.stringify(data.error));
            }
        }
        return { success: response.ok, error: error };

    } catch (error) {
        console.error('Error:', error)
        return { success: false, error: "Algo salió mal" }

    }
}
