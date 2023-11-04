import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useAuth } from '../hooks/auth'
import { useState } from 'react'

const RecoverIdBox = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Recover Id Box'));
  });
  const router = useRouter();
  // const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;

  // const submitForm = (e: any) => {
  //   e.preventDefault();
  //   router.push('/');
  // };

  const { forgotPassword } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState(null)

  const submitForm = event => {
    event.preventDefault()

    forgotPassword({ email, setErrors, setStatus })
  }
  useEffect(() => {
    if (errors.email) {
      toast.error("Please wait before retrying");
    }
  }, [errors]);
  useEffect(() => {

    if (status) {
      toast.success("Email has sended");
    }
  }, [status]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
      <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
        <h2 className="mb-3 text-2xl font-bold">Forgot Password</h2>
        <p className="mb-7 text-gray-500">
          Forgot your password? No problem. Just let us know your
          email address and we will email you a password reset link
          that will allow you to choose a new one.
        </p>
        <form className="space-y-5" onSubmit={submitForm}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter Email"
              name="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Email Password Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};
RecoverIdBox.getLayout = (page) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default RecoverIdBox;
