import mongoose from "mongoose";

const PremioSchema = new mongoose.Schema({ name: String});
const TunaSchema = new mongoose.Schema({ name: String});

const FestivalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tuna: {
        type: TunaSchema,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    premios: {
        type: [PremioSchema],
        required: true,
    },
    tunasConcurso: {
        type: [TunaSchema],
        required: true,
    },
    tunasExtra: {
        type: [TunaSchema],
        required: false,
    }
    //TODO: Adicionar cartaz do festival
},
{
    timestamps: true,
});

export const Festival = mongoose.model("Festival", FestivalSchema);