import React from 'react';
import { motion } from 'framer-motion';


const UserCard = ({ 
  index = 0,
  userObj, 
  onAcc, 
  onDeny
}) => {
  // Animation variants
  
  const user = userObj || {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com'
  }

  
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    }),
    exit: { opacity: 0, x: -100 }
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden mb-4"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{user.teacherName}</h3>
        <p className="text-sm text-gray-600 mt-1">@{user.teacherUsername}</p>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        <p className="text-sm text-gray-500 mt-1">{user.classInfo}</p>
        
        <div className="flex justify-end mt-4 space-x-3">
         {!user.granted && <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAcc(user.teacherId)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Accept
          </motion.button>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDeny(user.teacherId)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reject
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;