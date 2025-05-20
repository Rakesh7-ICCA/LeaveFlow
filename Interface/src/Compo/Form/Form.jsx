import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import CommonFields from "./CommonFields";
import axios from "axios";
import { Link } from "react-router";

const SignupForm = () => {
  const [role, setRole] = useState("student");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues:{
      classYear: "",
      classSection: "",
    }
  });

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [Batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);

  //Load avail universities from API
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://leaveflow.runasp.net/api/University/GetOrganizations")
        setColleges(res.data.organizations)
        console.log('yes')
      }
      catch (err) {
        alert(err)
      }
    })()
  }, [])

  // Load avail Colleges from API
  function afterChoosingOrg(e) {
    const orgId = e.target.value;
    (async () => {
      try {
        const res = await axios.get("https://leaveflow.runasp.net/api/BatchSection/GetBatchByOrg?orgId=" + orgId)
        if(res.data.batches) setBatches(res.data.batches)
      }
      catch (err) {
        alert(err)
      }
    })()
  }

  function afterChoosingBatch(e) {
  const batchId = e.target.value;
    (async () => {
      try {
        const res = await axios.get("https://leaveflow.runasp.net/api/BatchSection/GetSections?batchId=" + batchId)
        if(res.data.sections) setSections(res.data.sections)
      }
      catch (err) {
        alert(err)
      }
    })()
  }


  const onSubmit = (data) => {

    data.roleId = 0;
    if(role === "teacher")
    {
      //console.log(data);
      (async()=>{
        try {
          const res = await axios.post("https://leaveflow.runasp.net/api/Teacher/RegisterTeacher", data)
          alert(res.data.message)
          reset()
        }
        catch (err) {
          alert(err)
        }
      })()

    }
    else if(role === "student")
    {
      //console.log(data);
      (async()=>{
        try {
          const res = await axios.post("https://leaveflow.runasp.net/api/Student/RegisterStudent", data)
          alert(res.data.message)
          reset()
        }
        catch (err) {
          alert(err)
        }
      })()

    }
    // Submit logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)} autoComplete="off"
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Account
        </h2>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">I am a:</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 px-4 rounded-md border ${role === "student"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-2 px-4 rounded-md border ${role === "teacher"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              Teacher
            </button>
          </div>
        </div>

        <div className="space-y-4">

          {/* college Controller */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Choose your College
            </label>
            <select {...register('organizationId')} onChange={afterChoosingOrg} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-50 bg-white dark:bg-gray-800 
                          dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-200">
              <option disabled selected value="">Select your college</option>
              {colleges.map((college) => (
                <option className="" key={college.collegeId} value={college.orgId}>
                  {college.orgName}
                </option>


              ))
              }

            </select>

          </div>
          <CommonFields registerobj={register} errors={errors} />

          {/* Teacher-Specific Fields */}

          <div>
            <label className="block text-gray-700 mb-1">Choose your Batch</label>
            <select
              {...register("classYear", {
                required: "Batch is required",
              })}
              onChange={afterChoosingBatch}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Year</option>
              {
                Batches.map((batch) => (
                  <option key={batch.batchId} value={batch.batchId}>
                    {batch.batchName}
                  </option>
                ))
              }
            </select>
            {errors.teachingYear && (
              <p className="text-red-500 text-sm mt-1">
                {errors.teachingYear.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Section</label>
            <select 
              {...register("classSection", {
                required: "Section is required",
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="" >Select Section</option>
              {
                sections.map((section) => (
                  <option key={section.sectionId} value={section.sectionId}>
                    {section.sectionName}
                  </option>
                ))
              }
            </select>
            {errors.section && (
              <p className="text-red-500 text-sm mt-1">
                {errors.section.message}
              </p>
            )}
          </div>


        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;