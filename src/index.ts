import routes from './routers/hotelRoutes';
import express from 'express';
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'], // Adicione todas as origens necessárias aqui
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/hotel', routes);


const port = 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} 🚀🚀🚀`);
});
