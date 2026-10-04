import { z } from 'zod';

export const loginSchema = z.strictObject({
    email: z.email({ error: "Invalid Email Format" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/),
    lang: z.enum(['en', 'ar']).default('en').optional() //params
});

export const registerSchema = loginSchema.extend({
    firstName: z.string().regex(/^[\p{L}]{3,30}$/u),
    lastName: z.string().regex(/^[\p{L}]{3,30}$/u),
    age: z.number().min(18).max(100).optional(),
    gender: z.enum(['male', 'female', 'other']).default('other'),
    phoneNumber: z.string().regex(/^01[0125][0-9]{8}$/, { error: "Please Provide A Valid Egyptian Number" }),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    }
);
// To Use SuperRefine For Multiple Validation Issues
// .superRefine(
//     (data, ctx) => {
//         if(data.password !== data.confirmPassword){
//             ctx.addIssue({
//                 code: "custom",
//                 message: "Passwords do not match",
//                 path: ['confirmPassword']
//             })
//         }
//     }
// );