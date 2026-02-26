import express from 'express'
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')

})


app.post('/info', (req, res) => {
    //Recebimento dos dados

    const { device, time } = req.body
    const location = req.headers["x-forwarded-for"] 

    try {
        //Validação mor
        
        if (!device || !time) {
            res.status(400).json({
                status: "Erro",
                message: "Erro ao receber dados."
            })
        }

        //Main

        fetch(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: `${process.env.CHAT_KEY}`,
                text: `🚀 Teste do Tracker \n\n 💻 Dispositivo: ${device} \n 📍 Localização: ${location} \n ⌚ Hora: ${time}` 
            })
        })

        res.status(200).json({
            status: "Sucesso",
            message: "Jhones foi notificado com sucesso!"
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
