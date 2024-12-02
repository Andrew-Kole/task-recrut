import * as mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    index: { type: Number, required: true },
    thumbnail: { type: Buffer, required: true },
});

export const ImageModel = mongoose.model('Image', ImageSchema);