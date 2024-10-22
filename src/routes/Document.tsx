import '../assets/App.css'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import GraphQLqueries from '../GraphQLqueries';


function Document() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { id } = useParams()

  const apiAddress = import.meta.env.VITE_API_ADDRESS

  // useEffect(() => {
  //   const fetchDocument = async () => {
  //     try {
  //       let result
  //       const response = await fetch(`${apiAddress}/${id}`)
  //       if (response.ok) {
  //         result = await response.json()
  //         setTitle(result.data.title)
  //         setContent(result.data.content)
  //       }
  //     } catch (errorMsg) {
  //       console.error(errorMsg)
  //     }
  //   }
  //   fetchDocument()
  // }, []);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem('Bearer')
        console.log('id is defined and is : ', id)
        const query = GraphQLqueries.getDocument(id)
        let result
        const response = await fetch(`${apiAddress}/query`, {
          method: "POST",
          body: JSON.stringify({ query }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }

        })
        if (response.ok) {
          result = await response.json()
          console.log('new graphql test res is : ', result)
          setTitle(result.data.document.title)
          setContent(result.data.document.content)
        }
      } catch (errorMsg) {
        console.error(errorMsg)
      }
    }
    fetchDocument()
  }, []);

  // async function updateDocument() {
  //   try {
  //     await fetch (`${apiAddress}/${id}`, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         "title": title,
  //         "content": content
  //       }),
  //       method: "PUT"
  //     })
  //   } catch (errorMsg) {
  //     console.error(errorMsg)
  //   }
  // }

  async function updateDocument() {
    try {
      const query = GraphQLqueries.updateDocument(id, content)
      const token = localStorage.getItem('Bearer')

      await fetch (`${apiAddress}/query`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ query }),
        method: "POST"
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