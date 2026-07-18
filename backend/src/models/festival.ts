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
    }],
    cartaz: {
        data: Buffer,
        contentType: String,
    },
},
{
    timestamps: true,
});

export const Festival = mongoose.model("Festival", FestivalSchema);