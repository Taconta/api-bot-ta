const { google } = require('googleapis');

// Função para autenticação usando as credenciais da variável de ambiente
const authenticateGoogle = () => {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS); // Pega o JSON da variável de ambiente

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key.replace(/\\n/g, '\n'), // Corrige quebras de linha
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return auth;
};

// Função para buscar dados da planilha
const getSheetData = async (spreadsheetId, range) => {
    const auth = authenticateGoogle();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
    });

    return response.data.values;
};

module.exports = { getSheetData };

