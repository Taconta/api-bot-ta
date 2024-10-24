const express = require('express');
const bodyParser = require('body-parser');
const { getSheetData } = require('./googleSheets');
const twilio = require('twilio');

// Acessando as variáveis de ambiente
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Definição do ID da planilha e faixas
const spreadsheetId = '1hvj2MwnAx-uFA8nW6mpx0Zi1ZUIwoxKJK7Ms-quK3m0';
const ranges = {
    vencimentos: 'Vencimentos!A2:E',
    situacaoFiscal: 'Situação Fiscal!A2:E',
};

// Inicializando o Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para receber mensagens do WhatsApp
app.post('/whatsapp', async (req, res) => {
    const message = req.body.Body.trim().toLowerCase();

    if (message === 'olá, ta!') {
        try {
            // Obtendo dados do Google Sheets
            const userVencimentos = await getSheetData(spreadsheetId, ranges.vencimentos);
            const responseMessage = `Vencimentos: ${JSON.stringify(userVencimentos)}`;

            // Enviando mensagem via Twilio
            await client.messages.create({
                body: responseMessage,
                from: 'whatsapp:+SEU_NUMERO_TWILIO',
                to: req.body.From,
            });

            res.status(200).send('Mensagem enviada');
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            res.status(500).send('Erro ao enviar mensagem');
        }
    } else {
        res.status(400).send('Comando não reconhecido');
    }
});

// Definindo a porta a partir das variáveis de ambiente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

