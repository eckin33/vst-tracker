import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const app = express()
const port = 3000

app.use(express.json())
app.use(express.text());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')

})


app.post('/info', async (req, res) => {
    //Recebimento dos dados

    const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const { project, device, time, gateKey } = body
    const location = req.headers["x-forwarded-for"] || req.ip

    //console.log(req.headers)

    try {
        //Validação mor
        async function ipInfo() {
            const geoResponse = await fetch(`http://ip-api.com/json/${location}`);
            const geoData = await geoResponse.json();

            console.log(geoData)

            return geoData.city
        }

        let ipCity = await ipInfo()

        if (!project || !device || !time || !gateKey) {
            return res.status(400).json({
                status: "Erro",
                message: "Erro ao receber dados. Something is missing."
            })
        }

        switch (project) {
            case "portfolio":
                if (gateKey !== process.env.GATE_KEY_PORT) {
                    return res.status(401).json({
                        status: "Erro",
                        message: "Gate Key inválida. Acesso negado."
                    })
                }
                break;

            case "nobre":
                if (gateKey !== process.env.GATE_KEY_NOBRE) {
                    return res.status(401).json({
                        status: "Erro",
                        message: "Gate Key inválida. Acesso negado."
                    })
                }
                break;
        }

        //Main

        fetch(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: `${process.env.CHAT_KEY}`,
                text: `🚀 Nova visualização do ${project === "nobre" ? "site da Nobre Soluções Digitais" : project} \n\n 💻 Dispositivo: ${device} \n 📍 Localização: ${ipCity} + ip: ${location} \n ⌚ Hora: ${time}`
            })
        })

        res.status(200).json({
            status: "Sucesso",
            message: "Jhones foi notificado com sucesso!",
            location: location
        })

    } catch (error) {
        res.status(404).json({
            status: "Erro",
            message: "Deu B.O aí pra cima, resolve aí meu fi.",
            error: error
        })
    }

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
