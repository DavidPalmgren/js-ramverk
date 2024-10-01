//import { useState } from 'react'
import './assets/App.css'
import { useEffect, useState } from 'react'

function App() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS

  const [documents, setDocuments] = useState([])

  const [createToggle, setCreateToggle] = useState(false)
  const [title, setTitle] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let data
        const response = await fetch(`${apiAddress}`)
        if (response.ok) {
          data = await response.json()
          setDocuments(data.data)
          console.log(data.data)
        }
      } catch (errorMsg) {
        console.error(errorMsg)
      }
    }
    fetchDocuments()
  }, []);

  async function postDocument(title: string, content:string) {
    console.log(`vars: ${title}, ${content}`)
    try {
      const response = await fetch(`${apiAddress}`, {
        headers: {
          "Content-Type": "application/json"
        }, // error on backend so im swapping these so they'll be correct temporarily
        body: JSON.stringify({
          "title": content,
          "content": title
        }),
        method: "POST"
      }) //testa efter inte klar just nu
      const data = await response.json()
      console.log(data)

    } catch (errorMsg) {
      console.error(errorMsg)
    }
  }

  function toggleCreateDocument() {
    setCreateToggle(!createToggle)
  }
  // ts is very annoying dont think ill be using it very much honestly
  function createDocument(e:React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    console.log(`Your title is: ${title}`)
    postDocument(title, "filler contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller contentfiller content")
  }


  return (
    <>

      <h1>DocEditor Incorperated</h1>
      <div className='utility-bar'>
        <button className='button-blue' onClick={toggleCreateDocument}>Add +</button>
      </div>
      <div className='doc-create'>
        {createToggle && (
          
            <form onSubmit={createDocument} className='doc-form'>
              <label>Title</label>
              <input type="text" name="Title" placeholder='My Title' onChange={(e) => setTitle(e.target.value)}></input>
              <button type="submit">Add</button>
            </form>
          
        )}
      </div>
      <div className='doc-container'>
      {documents.map(doc => (
        <div className='doc-mini' key={doc._id}>
          <p className='doc-title'>
            {doc.title}
          </p>
          <div className='doc-subtext-container'>
            <p className='doc-subtext'>
              {doc.content}
            </p>
          </div>

          </div>
      ))}
      </div>
    </>
  )
}

export default App
