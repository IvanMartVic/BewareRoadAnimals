"use client"
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
        }
        return { success: response.ok, error: error };

    } catch (error) {
        console.error('Error:', error)
        return { success: false, error: "Algo salió mal" }

    }
}
