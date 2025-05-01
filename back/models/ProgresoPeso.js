// back/models/ProgresoPeso.js
import mongoose from "mongoose";

const ProgresoPesoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  peso: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ProgresoPeso", ProgresoPesoSchema);