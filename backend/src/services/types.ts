import { QueryParams } from "../schemas/products.schema";

export interface signUpProps {
  name: string;
  email: string;
  password: string;
}

export interface signInProps {
  email: string;
  password: string;
}
