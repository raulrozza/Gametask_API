import mongoose, { Document } from 'mongoose';
import { ITheme } from '@modules/games/entities';

interface IThemeDocument extends ITheme, Document {}

const ThemeSchema = new mongoose.Schema<IThemeDocument>(
  {
    primary: {
      type: String,
      required: true,
    },
    secondary: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default ThemeSchema;
