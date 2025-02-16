import * as yup from "yup";

export const loginSchema = yup.object().shape({
  deliveryAssociatedId: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")
    .required("ID is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});
