import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import InputLabel from "./InputLabel"
import axios from 'axios';

const Login = ({aa}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const path = useLocation().pathname
  console.log(path)

  const nav = useNavigate()
  const onSubmit = async(data) => {
    console.log(data)
    const res = await axios.post('https://leaveflow.runasp.net/api/autho/login', data)
    if(res.status == 200)
    { 
      // debugger;
      alert(res.data.message)
      let obj = res.data.result
      localStorage.setItem('mail', obj.email)
      localStorage.setItem('username', obj.username)
      localStorage.setItem('role', obj.role)
      localStorage.setItem('id', obj.id)
      aa(obj.role)
      nav("/", {replace:true})
    
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your LeaveFlow account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8"
        >

          <InputLabel label={"Username"} name={"username"} err={errors} getFunc={register} />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Sign In
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;