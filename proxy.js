const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/bin/:bin', async (req, res) => {
    const bin = req.params.bin;

    const apis = [
        // 1. bincheck.io
        async () => {
            const r = await fetch(`https://bincheck.io/details/${bin}`, {
                headers: {
                    'User-Agent': 'bin-proxy-render/1.0'
                }
            });
            if (!r.ok) throw new Error("bincheck.io falló");
            const d = await r.json();
            return {
                bank: { name: d.bank?.name || null },
                scheme: d.scheme,
                brand: d.brand,
                type: d.type,
                country: d.country?.name || null
            };
        },

        // 2. binlist.net
        async () => {
            const r = await fetch(`https://lookup.binlist.net/${bin}`, {
                headers: {
                    'User-Agent': 'bin-proxy-render/1.0'
                }
            });
            if (!r.ok) throw new Error("binlist.net falló");
            const d = await r.json();
            return {
                bank: { name: d.bank?.name || null },
                scheme: d.scheme,
                brand: d.brand,
                type: d.type,
                country: d.country?.name || null
            };
        },

        // 3. binlistapi.herokuapp.com
        async () => {
            const r = await fetch(`https://binlistapi.herokuapp.com/api/${bin}`, {
                headers: {
                    'User-Agent': 'bin-proxy-render/1.0'
                }
            });
            if (!r.ok) throw new Error("binlistapi.herokuapp falló");
            const d = await r.json();
            return {
                bank: { name: d.bank || null },
                scheme: d.scheme || null,
                brand: d.brand || null,
                type: d.type || null,
                country: d.country || null
            };
        },

        // 4. freebinchecker.com
        async () => {
            const r = await fetch(`https://api.freebinchecker.com/bin/${bin}`, {
                headers: {
                    'User-Agent': 'bin-proxy-render/1.0'
                }
            });
            if (!r.ok) throw new Error("freebinchecker.com falló");
            const d = await r.json();
            return {
                bank: { name: d.bank_name || null },
                scheme: d.card_scheme || null,
                brand: d.card_brand || null,
                type: d.card_type || null,
                country: d.country_name || null
            };
        },

        // 5. binbase.io
        async () => {
            const r = await fetch(`https://binbase.io/api/v1/bank/${bin}`, {
                headers: {
                    'User-Agent': 'bin-proxy-render/1.0'
                }
            });
            if (!r.ok) throw new Error("binbase.io falló");
            const d = await r.json();
            return {
                bank: { name: d.bank || null },
                scheme: d.card || null,
                brand: null,
                type: d.type || null,
                country: d.country || null
            };
        }
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            const result = await apis[i]();
            if (result.bank.name) {
                return res.json(result);
            }
        } catch (err) {
            console.warn(`❌ API ${i + 1} falló:`, err.message);
        }
    }

    return res.json({
        bank: { name: "Desconocida" },
        scheme: null,
        brand: null,
        type: null,
        country: null
    });
});

app.listen(PORT, () => {
    console.log(`🔥 Superproxy con 5+ APIs corriendo en el puerto ${PORT}`);
});
