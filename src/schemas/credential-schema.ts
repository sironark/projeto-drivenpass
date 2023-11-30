import Joi from 'joi';

export type CredentialType = {
  id?: number;
  url: string;
  username: string;
  password: string;
  title: string;
};

export const CredentialSchema = Joi.object<CredentialType>({
  url: Joi.string().uri().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().required(),
  title: Joi.string().required(),
});
