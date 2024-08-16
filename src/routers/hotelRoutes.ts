import { Router } from 'express';
import { adicionarHotel, listarHoteis, listarHoteisPorCNPJ, excluirHotel, atualizarHotel } from '../controllers/hotelController';

const routes: Router = Router();

routes.post('/', adicionarHotel);
routes.get('/', listarHoteis);
routes.get('/:cnpj', listarHoteisPorCNPJ);
routes.delete('/:id', excluirHotel);
routes.put('/:id', atualizarHotel);

export default routes;
