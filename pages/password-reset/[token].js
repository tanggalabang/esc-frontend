import { useRouter } from 'next/router';
import { useEffect } from 'react';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useAuth } from '../hooks/auth'
import { useState } from 'react'

const RecoverIdBox = () => {
  const router = useRouter()

  const { resetPassword } = useAuth({ middleware: 'guest' })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState(null)

  const submitForm = event => {
    event.preventDefault()

    resetPassword({
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
      setStatus,
    })
  }

  useEffect(() => {
    setEmail(router.query.email || '')
  }, [router.query.email])


  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
      <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
        <h2 className="mb-3 text-2xl font-bold">Password Reset</h2>
        <form className="space-y-5" onSubmit={submitForm}>
          {/* <div>
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
          </div> */}
          <div>
            <label htmlFor="email">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
              className="form-input"
              placeholder="Enter Password"
            />
          </div>
          <div>
            <label htmlFor="email">Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={event =>
                setPasswordConfirmation(event.target.value)
              }
              required
              className="form-input"
              placeholder="Enter Email"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            RESET PASSWORD
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
