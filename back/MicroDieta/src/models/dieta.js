const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MealSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  foods: {
    type: [String],
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
})

const MacrosSchema = new Schema({
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
})

const DietaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#4285F4",
  },
  calories: {
    type: Number,
    required: true,
  },
  macros: {
    type: MacrosSchema,
    required: true,
  },
  meals: {
    type: [MealSchema],
    required: true,
  },
  duration: {
    type: Number,
    default: 30,
  },
  difficulty: {
    type: String,
    default: "Media",
  },
  tags: {
    type: [String],
    default: [],
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model("Dieta", DietaSchema)
