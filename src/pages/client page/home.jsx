import Header from "../../Components/Client Components/Header"


const Home = () => {
  return (
    <div>
       <Header />
      <div className=" bg-gray-900 h-screen">
      <div className="   flex p-4 md:p-10 justify-center">
        <div className="flex flex-wrap justify-center items-center border bg-white w-full max-w-5xl rounded-2xl gap-4 p-6">
          
          <div className="flex flex-col items-start w-full sm:w-[45%] md:w-[30%]">
            <label className="text-sm font-semibold text-gray-700 mb-1">Start Date</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
            />
          </div>

          <div className="flex flex-col items-start w-full sm:w-[45%] md:w-[30%]">
            <label className="text-sm font-semibold text-gray-700 mb-1">End Date</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
            />
          </div>

          <div className="flex flex-col items-start w-full sm:w-[45%] md:w-[20%]">
            <label className="text-sm font-semibold text-gray-700 mb-1">Type</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Luxury</option>
              <option value="2">Normal</option>
              <option value="3">Low</option>
            </select>
          </div>

          <div className="w-full sm:w-auto flex justify-center md:items-end mt-2 md:mt-5">
            <button className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-700 transition">
              Search
            </button>
          </div>
</div>
        </div>
      </div>
    </div>
  )
}

export default Home
