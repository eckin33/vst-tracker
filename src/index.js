import express from 'express'
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')

})


app.post('/info', (req, res) => {
    //Recebimento dos dados

    const { device, location, time } = req.body

    try {
        //Validação mor
        
        if (!device || !location || !time) {
            res.status(400).json({
                status: "Erro",
                message: "Erro ao receber dados."
            })
        }

        //Main

        fetch("https://api.telegram.org/bot8291442432:AAEC8mg0l4Rn7jRjIqJSKbJ4jck9vdV8ofE/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: "8535287121",
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
