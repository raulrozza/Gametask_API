import mongoose from 'mongoose';

export interface ITheme {
  primary: string;
  secondary: string;
}

const ThemeSchema = new mongoose.Schema<ITheme>(
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
