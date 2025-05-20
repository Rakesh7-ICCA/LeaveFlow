import React, { useEffect } from 'react'
import Navigation from './Compo/Utilities/Navigation'
import Form from './Compo/Form/Form'
import { BrowserRouter } from 'react-router'
import Routing from './Compo/Routing/Routing'
import { Suspense } from 'react'
import Loading from './Compo/Utilities/Loading'
// import TeacherForm from './Compo/Form/StudentForm'
const App = () => {
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    setLoading(false)
  }
)
  
  return (
    <BrowserRouter>
      {
        loading ? <Loading /> :
            <Routing />
      }
      
    </BrowserRouter>
  )
}

export default App