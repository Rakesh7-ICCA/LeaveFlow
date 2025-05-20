import react, { useState } from "react";
import { useForm } from "react-hook-form";
import InputLabel from "../Form/InputLabel";
import axios from "axios";
import { Link } from "react-router";


export default function ServicePage() {
    const [formData, setFormData] = useState({ name: "", email: "", college: "" });
    const [message, setMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm()

    async function submitHandler(data) {
        try {
            const res = await axios.post("https://leaveflow.runasp.net/api/Request/addRequest", data)
            if (res.status === 200) {
                alert("Request submitted successfully! We will contact you soon.");
            } else {
                alert("Failed to submit request. Please try again.");
            }
        }
        catch (err) {
            alert(err);
        }
    }

    return (
        <>
            <nav className=" relative z-10 w-full flex justify-between items-center p-6 md:px-16">
                <h1 className="text-xl font-bold text-gray-900">Leave Flow</h1>
                
                <Link to={"/login"} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">Login</Link>
            </nav>
            <section className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mt-12">
                    <h1 className="text-4xl font-bold text-gray-900">Request to Add Your College</h1>
                    <p className="text-gray-600 mt-3">
                        Help us expand LeaveFlow to your institution! Fill out the form below, and we’ll get in touch with your administration.
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white shadow-lg rounded-lg p-8 mt-8 w-full max-w-lg">
                    {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                        <InputLabel label={"Name"} getFunc={register} name={"req_name"} err={errors} />
                        <InputLabel label={"E-mail"} getFunc={register} name={"req_email"} err={errors} typeObj="email" />
                        <InputLabel label={"College"} getFunc={register} name={"req_college"} err={errors} />

                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </section>
        </>

    );
}
