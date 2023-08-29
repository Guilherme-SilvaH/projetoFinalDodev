const { GoogleSpreadsheet } = require("google-spreadsheet");
const credenciais = require('./credentials.json');
const arquivo = require('./arquivo.json');
const { JWT } = require('google-auth-library');


const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets'
];

const jwt = new JWT({
    email: credenciais.client_email,
    key: credenciais.private_key,
    scopes: SCOPES,
});

// Função para autenticar e obter o objeto do documento GoogleSpreadsheet
async function getDoc() {
        const doc = new GoogleSpreadsheet(arquivo.id, jwt);
        await doc.loadInfo();
        return doc;
    }


// Função para ler as linhas da planilha e retornar os dados como objetos
async function ReadWorkSheet() {
   let sheet = (await getDoc()).sheetsByIndex[0];
   let rows = await sheet.getRows()
   let users = rows.map(row => {
    return row.toObject()
   })
   return users
}

// Função para adicionar dados à sua API
async function addUser(data = {}) {
   
        const response = await fetch('https://apigenerator.dronahq.com/api/xlLHYubh/data', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
        return response.json();
}

// Função para unir todas as funções
async function allfunction() {
    let data = await ReadWorkSheet();
    data.map(async (user) => {
        let response = await addUser(user)
        console.log(response);
    })
    return console.log("Dados copíados com sucesso");
}

// Chamar a função que une todas as ações
allfunction();