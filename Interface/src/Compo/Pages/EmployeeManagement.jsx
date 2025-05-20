import React, { useEffect, useRef, useState } from 'react'
import { AiFillDelete, AiFillProfile, AiOutlineBank, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { BsPeople, BsPersonAdd } from 'react-icons/bs'
import CommonFields from '../Form/CommonFields';
import InputLabel from '../Form/InputLabel';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import DefaultProfile from "../../assets/DefaultProfile.png"
import { RiProfileFill } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import ApiRe from '../Source.js'

const EmployeeManagement = () => {

  var [TempUser, setTempUser] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm()
  const formWrapper = useRef(null)
  const [Roles, setRoles] = useState([])

  //below this just for url
  const [Image, setImage] = useState("")

  //below this just for url
  const [ImageFile, setImageFile] = useState(null)

  const details = useRef(null);
  const images = useRef(null);


  const [Employees, setEmployees] = useState([])

  //Employee Loader
  useEffect(() => {
    (async () => {
      const res = await axios.get('https://leaveflow.runasp.net/api/Employee/GetEmployeesWithUser')
      if (res.status == 200 && res.data) {
        setEmployees(res.data)
      }
    })()
  }, [])



  //Roles Loader
  useEffect(() => {
    (async () => {
      const res = await axios.get('https://leaveflow.runasp.net/api/Roles/GetRoles?related=Company')
      if (res.status == 200) {
        setRoles(res.data)
      }
    })()
  }, [])


  //upload Image for api
  function sendImageForApi(e) {
    e.preventDefault()
    const data = new FormData()
    data.append('img', Image);
    // alert(TempUser) //need to remove
    data.append('Name', TempUser);

    (async () => {
      const res = await axios.post('https://leaveflow.runasp.net/api/Employee/addEmployeePic', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status == 200) {
        alert(res.data.message)
        Employees[Employees.length - 1].profilePicture = 'https://leaveflow.runasp.net/Uploads/Images/' + TempUser + '_profile.jpg'
        formWrapper.current.classList.toggle('hidden')

      }
      else {
        alert(res.data.message)
      }
    })()
  }

  //Employee Role Change Handler
  async function employeeRoleChangeHandler(userId, e) {
    let val = !confirm("Are you sure you want to change the role?") && false;

    const res = await axios.post('https://leaveflow.runasp.net/api/Employee/UpdateEmployeeRole?id=' + userId + '&roleId=' + e)
    const obj = { message: res.data.message, status: res.status }
    return obj;

  }

  //Employee Submit handler
  async function EmployeeSubmitHandler(data) {

    //before submit
    //Checks the username, email, adhar is repeated or not
    try {
      const res = await axios.get('https://leaveflow.runasp.net/api/Employee/EmployeeUniqueExist?email=' + data.email + '&adhar=' + data.adhar + '&username=' + data.userName)
      const str = res.data.message;
      if (str != "true") {
        alert(str)
        return
      }
    }
    catch (err) {
      alert(err)
    }


    //Submit part
    try {
      debugger;
      const res = await axios.post('https://leaveflow.runasp.net/api/employee/addemployee', data)
      if (res.status == 200) {
        alert(res.data.message)
        setTempUser(data.userName);
        setEmployees([...Employees, data])
        console.log(Employees)
        details.current.classList.toggle('hidden')
        images.current.classList.toggle('hidden')
      }
      else {
        alert(res.data.message)
      }
    }
    catch (err) {
      alert(err)
    }
  }

  //Delete Employee Handler
  async function deleteEmployeeHandler(userId) {
    const res = await axios.post('https://leaveflow.runasp.net/api/employee/deleteemployee?userId=' + userId)
    if (res.status == 200) {
      alert(res.data.message)
      setEmployees(Employees.filter((emp) => emp.userId != userId))
    }
    else {
      alert(res.data.message)
    }
  }


  return (
    <div >
      <p className='text-3xl mt-3'>Employee's Portal</p>

      <div>
        <form class="flex items-center w-full my-4 mx-auto ">
          <label for="simple-search" class="sr-only">Search</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <BsPeople className='text-gray-500 text-2xl' />
            </div>
            <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full ps-10 p-2.5 text-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
              placeholder="Search Employee" required />

          </div>
          <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-teal-700 rounded-lg border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">
            <AiOutlineSearch className='text-xl' />
          </button>
          <button type="button" data-modal-target="authentication-modal" data-modal-toggle="authentication-modal"
            onClick={() => { formWrapper.current.classList.toggle('hidden') }}
            class="p-2.5 ms-2 text-sm font-medium text-white bg-teal-700 rounded-lg border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">
            <BsPersonAdd className='text-xl' />
          </button>
        </form>
      </div>

      {/* Employee Details Collector */}

      <div ref={formWrapper} class="hidden flex items-center justify-center py-40 bg-gray-500/[.50] backdrop-blur-lg overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen  max-h-full">
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Add Employee to our Workspace
              </h3>
              <button type="button" onClick={() => { formWrapper.current.classList.toggle('hidden') }} class="end-2.5 text-gray-400 bg-transparent  hover:bg-red-200 hover:border hover:border-red-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                <AiOutlineClose size="40" />
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 md:p-5">
              {/* Details Collector */}
              <form onSubmit={handleSubmit(EmployeeSubmitHandler)} ref={details} className=''>
                <InputLabel label={"Name"} name={"Name"} err={errors} getFunc={register} />
                <InputLabel label={"Username"} name={"userName"} err={errors} getFunc={register} />
                <InputLabel label={"Date of Birth"} name={"dateOfBirth"} err={errors} getFunc={register} typeObj='date' />
                <InputLabel label={"Adhar"} name={"adhar"} err={errors} getFunc={register} />
                <InputLabel label={"Email"} name={"email"} err={errors} getFunc={register} typeObj='email' />
                <InputLabel label={"Password"} name={"password"} err={errors} getFunc={register} typeObj='password' />
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select {...register("roleId")} className='"w-full px-4 py-2 border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-teal-500
                          bg-white dark:bg-gray-800 
                          dark:border-gray-600 
                          dark:text-white 
                          dark:placeholder-gray-400
                          transition-colors duration-200'>
                    <option value="" className=''>Select Role</option>
                    {
                      Roles.map(roles => {
                        return <option value={roles.roleId}>{roles.roleName}</option>
                      })
                    }
                  </select>
                </div>


                <button
                  type="submit"
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200"
                >
                  Next
                </button>
              </form>

              {/* image submitter */}
              <form ref={images} className='hidden'>
                <div className='h-[30vh]  '>
                  <h1 className='text-center text-2xl'>Add a Profile</h1>
                  <div id='ProfileImgWrapper' className=' text-[5vw] flex items-center  justify-center'>
                    {!Image ? <CgProfile /> : <img src={Image} className='object-fit w-20 h-20' />}
                  </div>

                  <div className='flex gap-3'>

                    <label
                      htmlFor='imgSet'
                      className="w-full mt-6 text-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200"
                    >
                      Choose Image
                      <input type="file" id='imgSet' className='hidden' onChange={e => setImage(e.target.files[0])} />
                    </label>
                    <button
                      type="submit" onClick={sendImageForApi}
                      className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200"
                    >
                      Submit
                    </button>
                  </div>

                </div>
              </form>


            </div>
          </div>
        </div>
      </div>
                  
      {
    
        Employees.length <= 0 ?
        (<p className='text-center text-2xl'>Employees not Found</p>) 
        :
        <table border={"1px"} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-teal-100 dark:bg-teal-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Profile
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>


        </thead>

        {/* Table Body */}
        <tbody >
          {
            Employees.map((employee, index) => (
              <tr className='border-b hover:bg-teal-50 dark:hover:bg-teal-700 py-4'>
                <td className='text-center'>{index + 1}</td>
                <td className='px-6 py-4  items-center h-full justify-center'>
                  <img src={employee.profilePicture ? employee.profilePicture : DefaultProfile} className='mx-auto w-10 h-10 rounded-full' />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{employee.email}</td>

                {/* Employee Role */}
                <td>
                  <select className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white" value={employee.roleId} 
                  onChange={(e1) => {
                    // debugger;
                    let val = e1.target.value
                    // alert(employee.roleId+' '+e1.target.value)
                    employeeRoleChangeHandler(employee.userId, e1.target.value).then((obj) => {
                      if (obj.status == 200) {
                        employee.roleId = val
                        e1.target.value = val;
                        alert(obj.message)
                      }
                      else {
                        alert(obj.message)
                      }
                    })
                  }}>
                    <option value="" className=''>Select Role</option>
                    {
                      Roles.map(roles => {
                        return <option value={roles.roleId}>{roles.roleName}</option>
                      })
                    }

                  </select>

                </td>


                {/* Actions */}
                <td className='text-red-300 text-center'><AiFillDelete className='mx-auto text-2xl' onClick={()=>{deleteEmployeeHandler(employee.userId)}} /></td>
              </tr>
            ))
          }
        </tbody>
      </table>}
    </div>
  )
}

export default EmployeeManagement