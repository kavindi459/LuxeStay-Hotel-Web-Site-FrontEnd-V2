import React , { useState } from 'react'

export default function AdminFeedback() {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = () => {
    setShowPopup(true);
  }


  return (
    <div>
    <div>


      <button
      onClick={handlePopup}
      className='bg-black text-white p-2 rounded-md'>Popup</button>
    </div>
    <div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p>Popup content goes here</p>
            <button className='bg-black text-white p-2 rounded-md' onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>

    </div>
  )
}
