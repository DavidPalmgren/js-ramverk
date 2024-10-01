import '../assets/App.css'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';


function Document() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { id } = useParams()

  const apiAddress = import.meta.env.VITE_API_ADDRESS

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        let result
        const response = await fetch(`${apiAddress}/${id}`)
        if (response.ok) {
          result = await response.json()
          setTitle(result.data.title)
          setContent(result.data.content)
        }
      } catch (errorMsg) {
        console.error(errorMsg)
      }
    }
    fetchDocument()
  }, []);

  async function updateDocument() {
    try {
      await fetch (`${apiAddress}/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "title": title,
          "content": content
        }),
        method: "PUT"
      })
    } catch (errorMsg) {
      console.error(errorMsg)
    }
  }


 
  return (
    <>
    {/* temp button */}
    <Link to={"/"}><button className='button-blue margin-low'> Return</button></Link>
    <button className='button-blue' onClick={updateDocument}>Update</button>
    <br></br>
    <br></br>
      <div className='single-doc-wrapper'>
        
        <div className='single-doc-title'>
          <textarea 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div className='single-doc-content'>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
        </div>
      </div>
    </>
  )
}


export default Document