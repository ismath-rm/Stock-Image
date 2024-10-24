import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../Redux/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const ResetPassword = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formError, setFormError] = useState('');
    const { isLoading } = useSelector((state) => state.auth);

    const initialValues = {
        password: '',
        confirm_password: '',
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(4, 'Password must be at least 4 characters')
            .required('Required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        setFormError(''); // Clear any previous form errors
        dispatch(resetPassword({ uidb64, token, password: values.password }))
            .unwrap()
            .then(() => {
                toast.success('Password reset successful');
                navigate('/'); // Navigate directly to the login page
            })
            .catch((err) => {
                const errorMessage = err.detail || 'An error occurred. Please try again later.';
                setFormError(errorMessage);
                toast.error(errorMessage);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <div className="flex w-full h-screen items-center justify-center" style={{ backgroundColor: '#221d30' }}>
            <div className="bg-[#38304f] bg-opacity-75 backdrop-blur-md w-full md:w-96 p-8 rounded-lg shadow-2xl">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col w-full text-left">
                            <p className="text-3xl text-white font-bold text-center">Reset Your Password</p>

                            <label htmlFor="password" className="text-left block text-gray-300 text-sm font-bold mb-2">
                                New Password
                            </label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your new password"
                                className="w-full px-3 py-2 mb-3 text-sm font-medium outline-none bg-white placeholder:text-gray-700 text-black rounded-lg"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mb-2" />

                            <label htmlFor="confirm_password" className="text-left block text-gray-300 text-sm font-bold mb-2">
                                Confirm Password
                            </label>
                            <Field
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                placeholder="Confirm your new password"
                                className="w-full px-3 py-2 mb-3 text-sm font-medium outline-none bg-white placeholder:text-gray-700 text-black rounded-lg"
                            />
                            <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm mb-2" />

                            <button
                                type="submit"
                                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-blue-500"
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting || isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassword;
