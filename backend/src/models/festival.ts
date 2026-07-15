import mongoose from "mongoose";

const FestivalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tuna: {
        type:{name: String},
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
    premios: [{
        name: String
    }],
    tunasConcurso: [{
        name: String
    }],
    tunasExtra: [{
        name: String
    }]
    //TODO: Adicionar cartaz do festival
},
{
    timestamps: true,
});

export const Festival = mongoose.model("Festival", FestivalSchema);