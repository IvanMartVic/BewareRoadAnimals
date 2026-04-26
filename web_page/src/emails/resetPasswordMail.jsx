import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components'


export default function ResetPasswordMail({
    resetUrl
}) {
    return (
        <Html>
            <Tailwind>
                <Head />
                <Preview >Restablece tu contraseña de road_animals</Preview>
                <Body >
                    <Container>
                        <Heading className='text-[#468432] font-bold'>Restablecer contraseña</Heading>
                        <Text >
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en la web de road animals.
                            Si fuiste tu, haz click en el link de abajo:
                        </Text>

                        <Section>
                            <a href={resetUrl}>
                                {resetUrl}
                            </a>
                        </Section>

                        <Text >
                            Este enlace expirara en 1 hora por seguridad.
                        </Text>

                        <Text  style={alertText}>
                            Si NO solicitaste restablecer tu contraseña, ignora este email
                            y tu contraseña permanecera sin cambios.
                        </Text>
                    </Container>
                </Body>

            </Tailwind>
        </Html>
    )
}

const alertText = {
    color: '#d9534f',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '24px 40px',
    padding: '12px',
    backgroundColor: '#f9f2f2',
    borderRadius: '4px',
}
