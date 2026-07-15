import express from "express";
import { Festival } from "../models/festival";

class FestivalController {
    getFestivais = async (req: express.Request, res: express.Response) => {
        try {
            const festivais = await Festival.find();
            return res.status(200).json({ data: festivais });
        } catch (error) {
            return res.status(404).json({ message: "Error fetching festivals", error });
        }
    }

    getFestivalById = async (req: express.Request, res: express.Response) => {
        try {
            const {id} = req.params;
            const festival = await Festival.findById(id);
            return res.status(200).json({ data: festival });
        } catch (error) {
            return res.status(404).json({ message: "Error fetching festival by ID", error });
        }
    }

    createFestival = async (req: express.Request, res: express.Response) => {
        try {
            const { name, tuna, location, date, premios, tunasConcurso, tunasExtra } = req.body;
            const festival = new Festival({ 
                name, 
                tuna, 
                location, 
                date, 
                premios, 
                tunasConcurso, 
                tunasExtra 
            });

            await festival.save();
            return res.status(201).json({ message: "Festival created successfully", data: festival });
        } catch (error) {
            return res.status(400).json({ message: "Error creating festival", error });
        }
    }

    updateFestival = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;
            const { name, tuna, location, date, premios, tunasConcurso, tunasExtra } = req.body;

            const festival = await Festival.findByIdAndUpdate(id, { 
                name, 
                tuna, 
                location, 
                date, 
                premios, 
                tunasConcurso, 
                tunasExtra 
            }, { new: true });

            await festival?.save();
            return res.status(200).json({ message: "Festival updated successfully", data: festival });
        } catch (error) {
            return res.status(400).json({ message: "Error updating festival", error });
        }
    }

    deleteFestival = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;
            await Festival.findByIdAndDelete({_id: id});
            return res.status(200).json({ message: "Festival deleted successfully" });
        } catch (error) {
            return res.status(400).json({ message: "Error deleting festival", error });
        }
    }

};

export default new FestivalController;

