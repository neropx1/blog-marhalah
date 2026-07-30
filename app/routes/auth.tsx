// app/routes/auth.tsx
import { useEffect } from "react";

export default function AuthRedirect() {
    useEffect(() => {
        // Biarkan script Netlify OAuth menangani window pop-up ini
        if (window.opener) {
            window.close();
        }
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
            <h2>Autentikasi sedang diproses...</h2>
            <p>Jendela ini akan tertutup otomatis.</p>
        </div>
    );
}