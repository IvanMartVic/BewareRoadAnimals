// app/api/enviar-bienvenida/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import ResetPasswordMail from '@/emails/resetPasswordMail'
import crypto from 'crypto';
import { prisma } from '@/../lib/prisma';
import { ErrorResponse } from 'resend';

// Inicializar Resend con tu API Key
const resend = new Resend(process.env.RESEND_API_KEY)
export interface emailServiceResponse{
    error? : ErrorResponse | unknown,
    data? : object,
}

export async function POST(request: Request):Promise<NextResponse<emailServiceResponse>> {
    try {
        // Obtener datos del cuerpo de la petición
        const HOUR_IN_MSEC = 60 * 60 * 1000;
        const { email } = await request.json()
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + HOUR_IN_MSEC);
        const user = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                resetToken: resetToken,
                tokenExpiry: tokenExpiry,
            }
        });
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        // Enviar el email
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Restablecer contraseña Road Animals',
            react: ResetPasswordMail({ resetUrl: `${baseUrl}/reset/new_pass?token=${resetToken}` }),
        })

        if (error) {
            return NextResponse.json({ error }, { status: 400 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}
