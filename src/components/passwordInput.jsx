export default function PasswordInput({onValueChanged}){
    const handleChange = (event) => {
        onValueChanged(event.target.value);
    }

    return (
        <>
            <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                        ></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                </svg>
                <input
                    type="password"
                    required
                    placeholder="Contraseña"
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="La contraseña tiene que tener más de 8 caracteres, al menos un número una letra mayúscula y una minúscula"
                    onChange={handleChange}
                />
            </label>
            <p className="validator-hint hidden">
                tiene que tener 8 caracteres, con:
                <br /> Al menos un número<br /> Al menos una letra mayúscula <br /> Al menos una letra minúscula
            </p>        
        </>
    )
}
