import Joi from 'joi';

export type NetworkType = {
  id?: number;
  network: string;
  password: string;
  title: string;
};

export const NetworkSchema = Joi.object<NetworkType>({
  network: Joi.string().required(),
  password: Joi.string().required(),
  title: Joi.string().min(1).required(),
});
