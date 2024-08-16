import { Request, Response } from 'express';
import Hotel from "../models/hotel";

const adicionarHotel = async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json('Error');
    }
}

const listarHoteis = async (req: Request, res: Response) => {
    try {
        const hoteis = await Hotel.findAll();
        res.status(201).json(hoteis);
    } catch (error) {
        res.status(400).json('Error ao listar hotéis');
    }
}

const listarHoteisPorCNPJ = async (req: Request, res: Response) => { 
    try {
        const cnpj = req.params.cnpj;
        const hoteisPorCnpj = await Hotel.findOne({
            where: {
                cnpj,
            }
        });
        res.status(201).json(hoteisPorCnpj);
    } catch (error) {
        res.status(400).json('Hotel não existe!');
    }
}

const excluirHotel = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const hotelExluir = await Hotel.findByPk(id);
        await hotelExluir?.destroy();
        res.status(201).json('Hotel excluído');
    } catch (error) {
        res.status(400).json('Não foi possível excluir hotel');
    }
}

const atualizarHotel = async (req: Request, res: Response) => {
    const { nome, localizacao } = req.body;
    try {
        const id = req.params.id;
        const hotelAtualizar = await Hotel.findByPk(id);

        if (hotelAtualizar) {
            hotelAtualizar.nome = nome;
            hotelAtualizar.localizacao = localizacao;
            await hotelAtualizar.save();
            res.status(201).json(hotelAtualizar);
        } else {
            res.status(404).json('Hotel não encontrado');
        }
    } catch (error) {
        res.status(400).json('Não foi possível atualizar o hotel');
    }
}

export { adicionarHotel, listarHoteis, listarHoteisPorCNPJ, excluirHotel, atualizarHotel };
