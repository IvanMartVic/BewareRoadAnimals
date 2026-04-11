export default function NombreApellidosInput({onValueChanged: onChange, value, disabled=false}) {
    const handleChange = (event) => {
        onChange(event.target.value);
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </g>
                </svg>
                <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido(s)"
                    // pattern="[A-Za-z][A-Za-z]* [A-Za-z][A-Za-z]*( [A-Za-z][A-Za-z-]*)?"
                    pattern="^[A-Za-z]+(\s[A-Za-z]+){1,2}$"
                    minLength="6"
                    maxLength="90"
                    title="Only letters, numbers or dash"
                    onChange={handleChange}
                    value={value}
                    disabled={disabled}
                />
            </label>
            <p className="validator-hint hidden">
                Al menos nombre y un apellido,
                <br />solo letras <br /> entre 6 y 90 caracteres
            </p>
        </>
    )

}
