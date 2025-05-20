import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiUser, FiDollarSign, FiDatabase } from 'react-icons/fi';
import CollegeInfoModal from '../CompUser/CompletionModal';
import DetailedInstitute from './DetailedInstitute';
const Institutes = () => {
  // Sample data - replace with your actual data source
  const [organizations, setOrganization] = useState([]);
  const [verify, setVerify] = useState(false)
  const [id, setId] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('https://leaveflow.runasp.net/api/Organizations/GetOrganizations')
        if (res.status == 200 && res.data.institutes) {

          setOrganization(res.data.institutes)
          console.log(organizations)
        }
      }
      catch (err) {
        alert(err)
      }
    })()
  }, [])

  async function grantOrganization(orgId, inde) {
    const res = await axios.post('https://leaveflow.runasp.net/api/Organizations/GrantOrganization?orgId=' + orgId)
    if (res.status == 200) {
      alert(res.data.message)
      setOrganization(prevOrgs =>
        prevOrgs.map((org, index) =>
          index === inde ? { ...org, granted: true } : org
        )
      )
    }
    else {
      alert(res.data.message)
    }
  }

  async function blockOrganization(orgId, inde) {

    const res = await axios.get('https://leaveflow.runasp.net/api/Organizations/BlockService?orgId=' + orgId)
    if (res.status == 200) {
      alert(res.data.message)
      setOrganization(prevOrgs =>
        prevOrgs.map((org, index) =>
          index === inde ? { ...org, granted: false } : org
        )
      )
    }
    else {
      alert(res.data.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Educational Institutes</h1>
      {verify && <DetailedInstitute onClose={() => { setVerify(false) }} id={id} functionObj={{ allow: grantOrganization }} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {
          organizations.length <=  0?
          (<p className='text-3xl text-center w-full col-span-4 bg-teal-300 py-1'>Not yet any institues get our service</p>):
          organizations.map((org, inde) => (
            <div
              key={org.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {/* <span className="text-4xl">{org.logo}</span> */}
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{org.orgName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {org.orgId}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiUser className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Principal</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{org.orgHead}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Annual Budget</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{org.amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiDatabase className="text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Handled</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{org.handled}</p>
                    </div>
                  </div>
                </div>

                <button
                  className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
                  onClick={() => { setId(org.orgId); setVerify(true) }}
                >

                  View Details
                </button>

                <div className='flex gap-1'>
                  {!org.granted && <button
                    className="mt-2 w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white rounded-lg transition-colors"
                    onClick={() => { grantOrganization(org.orgId, inde); }}
                  >

                    Grant
                  </button>}
                  <button
                    className="mt-2 w-full py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors"
                    onClick={(e) => { e.target.innerText == "Block Service" ? blockOrganization(org.orgId, inde) : null }}
                  >

                    {org.granted ? "Block Service" : "Deny"}
                  </button>

                </div>

              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Institutes;