import React from 'react'

export default function AdminRooms() {
  useEffect(() => {
    const featchCategories = async () => {
      setCategoriesIsLoading(false);
      const token = localStorage.getItem("token");

      try {
        if (token !== null) {
          const response = await axios.get(`${BACKEND_URL}/api/category/get`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          setCategories(response.data.data);
          setCategoriesIsLoading(false);
        } else {
          setCategoriesIsLoading(false);
          setCategories([]);
        }
      } catch (error) {
        console.log(error);
        setCategoriesIsLoading(false);
        setCategories([]);
      }
    };
    featchCategories();
  }, [categoriesIsLoading]);
  return (
    <div>
      <h1>Rooms</h1>
    </div>
  )
} 


