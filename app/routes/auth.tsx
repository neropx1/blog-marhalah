// app/routes/auth.tsx
import { useEffect, useState } from "react";

export default function AuthRedirect() {
    const [status, setStatus] = useState("Menghubungkan ke GitHub...");

    useEffect(() => {
        // Pastikan kode ini hanya berjalan di sisi browser (client-side)
        if (typeof window === "undefined") return;

        const hash = window.location.hash;
        const search = window.location.search;
        const token = new URLSearchParams(search).get("access_token") || hash;

        if (window.opener) {
            window.opener.postMessage(
                {
                    provider: "github",
                    token: token,
                },
                window.location.origin
            );
            setStatus("Autentikasi Berhasil! Menutup jendela...");
            setTimeout(() => {
                window.close();
            }, 1000);
        } else {
            setStatus("Gagal mendeteksi jendela utama. Silakan tutup tab ini.");
        }
    }, []);

    return (
        <div style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
            <h3>{status}</h3>
        </div>
    );
}