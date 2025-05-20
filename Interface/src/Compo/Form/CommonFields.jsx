import React from 'react'
import InputLabel from './InputLabel'
import { useForm } from 'react-hook-form'

const CommonFields = ({registerobj, errors}) => {

   
    const patternObj = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      }
  return (
    <>
        <InputLabel name={"name"} label={"Name"} getFunc={registerobj} err={errors} />
        <InputLabel name={"userName"} label={"Username"} getFunc={registerobj} err={errors} />
        <InputLabel name={"DOB"} label={"Date of Birth"} getFunc={registerobj} typeObj='date' err={errors} />
        <InputLabel name={"adharNumber"} label={"Adhar Number"} getFunc={registerobj} err={errors} />
        <InputLabel name={"email"} label={"Email"} getFunc={registerobj} patternObj={patternObj} err={errors} />
        <InputLabel name={"password"} label={"Password"} getFunc={registerobj} err={errors} typeObj='password' />
        
    </>
  )
}

export default CommonFields