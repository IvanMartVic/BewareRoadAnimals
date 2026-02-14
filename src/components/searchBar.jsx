"use client"
import { useState } from "react";
export default function SearchBar({onSearch}){
    const handleKeyUp = (e) => {
        if (e.key && e.key == 'Enter'){
            onSearch({searchInput});
        }
    }
    const [searchInput, setSearchInput] = useState("");
    return(
        <label className="input w-72">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" required placeholder="Buscar" onKeyUp={handleKeyUp} onChange={(e) => setSearchInput(e.target.value)}/>
        </label>
    );
}
