import React,{ useEffect }  from 'react'
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';

const AuthWrapper = () => {

    const navigate = useNavigate();
    const user = localStorage.getItem('role');

    useEffect(() => {
        if (!user) {
            navigate('/landing');
        }
    }, [user]);

    return (
        <Outlet />
    )
}

export default AuthWrapper