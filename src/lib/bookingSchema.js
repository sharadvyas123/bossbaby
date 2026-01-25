import * as yup from 'yup';

export const bookingSchema = yup.object().shape({
  babyName: yup
    .string()
    .required('Baby name is required')
    .min(2, 'Baby name must be at least 2 characters')
    .max(50, 'Baby name must be less than 50 characters'),
  babyAge: yup
    .number()
    .required('Baby age is required')
    .positive('Baby age must be a positive number')
    .integer('Baby age must be a whole number')
    .min(0, 'Baby age cannot be negative')
    .max(120, 'Baby age seems too high'),
  photoType: yup
    .string()
    .required('Photo type is required')
    .oneOf(['newborn', 'toddler', 'family', 'Maternity', 'Baby & family'], 'Please select a valid photo type'),
  date: yup
    .string()
    .required('Date is required'),
  timeSlot: yup
    .string()
    .required('Time slot is required'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[1-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});
