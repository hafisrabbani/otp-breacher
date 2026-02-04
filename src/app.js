import express from 'express';
import { query } from './config/db.js';

const app = express();
app.use(express.json());

// --- UI ENDPOINT ---
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP BREACHER // PUNK-MODE</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --neon-yellow: #ffff00;
                --neon-pink: #ff00ff;
                --neon-blue: #00ffff;
                --bg-dark: #050505;
            }
            body {
                background-color: var(--bg-dark);
                color: #fff;
                font-family: 'Space Mono', monospace;
                background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                background-size: 30px 30px;
                min-height: 100vh;
                display: flex;
                align-items: center;
            }
            .punk-container {
                max-width: 600px;
                width: 100%;
                margin: auto;
                padding: 20px;
            }
            .main-frame {
                border: 4px solid var(--neon-yellow);
                background: #000;
                padding: 30px;
                box-shadow: 15px 15px 0px var(--neon-pink);
                position: relative;
                transform: rotate(-1deg);
            }
            .main-frame::after {
                content: "DB2_ROOT_ACCESS";
                position: absolute;
                bottom: -15px;
                right: 20px;
                background: var(--neon-blue);
                color: #000;
                font-size: 0.7rem;
                padding: 2px 10px;
                font-weight: bold;
            }
            h1 {
                font-family: 'Permanent Marker', cursive;
                color: var(--neon-yellow);
                font-size: 3.5rem;
                text-align: center;
                text-shadow: 4px 4px 0px var(--neon-pink);
                margin-bottom: 30px;
            }
            .form-control {
                background: #111;
                border: 2px solid var(--neon-yellow);
                color: var(--neon-blue) !important;
                border-radius: 0;
                font-weight: bold;
            }
            .form-control:focus {
                background: #000;
                border-color: var(--neon-pink);
                box-shadow: 0 0 15px var(--neon-pink);
            }
            .btn-punk {
                background: var(--neon-yellow);
                color: #000;
                border: none;
                border-radius: 0;
                font-weight: 900;
                padding: 12px;
                width: 100%;
                text-transform: uppercase;
                margin-top: 15px;
                transition: 0.2s;
            }
            .btn-punk:hover {
                background: var(--neon-pink);
                color: #fff;
                transform: scale(1.02);
            }
            #resultBox {
                margin-top: 30px;
                border: 2px dashed var(--neon-blue);
                padding: 20px;
                display: none;
                text-align: center;
            }
            .otp-text {
                font-size: 3rem;
                color: var(--neon-pink);
                font-weight: bold;
                letter-spacing: 10px;
                text-shadow: 2px 2px var(--neon-blue);
            }
            .glitch-text { font-size: 0.8rem; color: #666; }
        </style>
    </head>
    <body>
        <div class="punk-container">
            <h1>OTP_BREACHER</h1>
            <div class="main-frame">
                <div class="text-center">
                    <img src="https://i.ibb.co.com/RTwgTzM4/tengkorak-punk-dengan-simbol-anarki-153969-9488-removebg-preview.png" class="img-responsive" style="max-width: 50%"/>
                </div>
                <div class="mb-3">
                    <label class="form-label text-uppercase small">Enter Target UserID</label>
                    <input type="text" id="targetId" class="form-control" placeholder="e.g. ADMIN_01">
                </div>
                <button onclick="fetchOTP()" class="btn-punk">Execute Breach</button>

                <div id="resultBox">
                    <div class="glitch-text mb-2">>> DATA_RETRIEVED_SUCCESSFULLY</div>
                    <div id="otpOutput" class="otp-text">------</div>
                </div>
            </div>
        </div>

        <script>
            async function fetchOTP() {
                const userId = document.getElementById('targetId').value;
                const box = document.getElementById('resultBox');
                const output = document.getElementById('otpOutput');

                if(!userId) return alert('Input User ID!');

                try {
                    const res = await fetch('/get-otp/' + userId);
                    const data = await res.json();
                    
                    box.style.display = 'block';
                    if(data.success) {
                        output.innerText = data.otp;
                        output.style.color = 'var(--neon-pink)';
                    } else {
                        output.innerText = 'NOT_FOUND';
                        output.style.color = 'red';
                    }
                } catch (err) {
                    alert('CRITICAL_FAILURE: Cannot reach server');
                }
            }
        </script>
    </body>
    </html>
    `);
});

// --- API ENDPOINT (Sudah Ada) ---
app.get('/get-otp/:userId', async (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT alm.ONE_TOKEN_STR AS otp
        FROM DB2ADMIN.A_LOGIN_MST alm
        WHERE alm.USER_ID = ?
    `;

    try {
        const result = await query(sql, [userId]);

        if (result.length > 0) {
            res.json({
                success: true,
                otp: result[0].OTP
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User ID not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});