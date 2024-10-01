import '../assets/App.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';


function Document() {
  const [document, setDocument] = useState({})
  const { id } = useParams()

  const apiAddress = import.meta.env.VITE_API_ADDRESS

  console.log(`id: ${id}`)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        let data
        const response = await fetch(`${apiAddress}/${id}`)
        if (response.ok) {
          data = await response.json()
          setDocument(data.data)
          console.log(data.data)
        }
      } catch (errorMsg) {
        console.error(errorMsg)
      }
    }
    fetchDocument()
  }, []);
 
  return (
    <h1>Hello sir</h1>
  )
}


export default Document