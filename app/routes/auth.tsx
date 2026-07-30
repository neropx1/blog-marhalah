// app/routes/auth.tsx
import { useEffect } from "react";

// Deklarasi agar TypeScript tidak protes soal window.netlifyIdentity
declare global {
    interface Window {
        netlifyIdentity?: any;
    }
}

export default function AuthRedirect() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", (user: any) => {
                    if (!user) {
                        window.netlifyIdentity.open();
                    }
                });
            }
        };
    }, []);

    return (
        <div style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
            <h3>Menghubungkan ke GitHub...</h3>
            <p>Mohon tunggu sebentar, jendela ini akan menutup otomatis setelah selesai.</p>
        </div>
    );
}