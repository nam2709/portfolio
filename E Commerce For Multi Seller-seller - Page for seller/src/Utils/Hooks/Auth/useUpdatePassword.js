
import { passwordConfirmationSchema, passwordSchema, YupObject } from "../../Validation/ValidationSchemas";

export const UpdatePasswordSchema = YupObject({ password: passwordSchema, password_confirmation: passwordConfirmationSchema });

