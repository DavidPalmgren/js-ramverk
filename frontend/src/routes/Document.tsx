import '../assets/App.css'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';


function Document() {
  const [title, setTitle] = useState("MyTitle")
  const [content, setContent] = useState("")
  const { id } = useParams()

  const apiAddress = import.meta.env.VITE_API_ADDRESS

  useEffect(() => {
    console.log("change to title or content")
    console.log(content)
  }, [content])

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

  function handleContent(e) {
    setContent(e)
    console.log(content)
    const lines = content.split('\n')
    console.log(lines)

  }

  const handleSelection = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
  
    if (selectedText) {
      const textarea = event.target;
      const start = textarea.selectionStart;
      console.log('start : ', start) // start of say each line 5+1 newline gets the start chara count on the 
      const lines = textarea.value.split('\n');
  
      let lineNum = 0;
      let charCount = 0;
  
      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // +1 for the newline
        if (start < charCount) {
          lineNum = i;
          break;
        }
      }
      //todo?
      // add the 
  
      console.log('Selected text:', selectedText);
      console.log('Line number:', lineNum + 1); // +1 for actual line not idx
    }
  };

  const handleDivAreaSelection = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    //console.log('Selection: ', selectedText);

    const mainDiv = document.getElementsByClassName("div-textarea")[0];
    const children = mainDiv.children;
    //console.log('num of lines: ', children.length);

    if (selectedText) {
        let found
        const range = selection.getRangeAt(0);
        const startNode = range.startContainer;

        for (let i = 0; i < children.length; i++) {
            if (children[i].contains(startNode)) {
                console.log(`Selected line: ${i + 2}`, children[i].innerHTML); //+1 for non-idx, +1 for first line not being a div for some reason
                found = true
                break;
            }
        }
        if (!found) { //naive approach but should work for most cases
          console.log(`Selected line: ${1}`, children[0].innerHTML); //+1 for non-idx, +1 for first line not being a div for some reason
        }
    }
};

  const handleContentChange = (e) => {
    setContent(e.target.innerHTML); // Use innerHTML for content-editable

  };

 
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
          {/*
          <textarea
            value={content}
            onChange={(e) => handleContent(e.target.value)}
            onMouseUp={(e) => handleSelection(e)}
            rows={10}
            cols={50}
          /> */}
           <div
            className='div-textarea'
            contentEditable
            onInput={handleContentChange}
            onMouseUp={(e) => handleDivAreaSelection(e)}
             // Set initial content
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              minHeight: '100px',
            }}
          />
        </div>

      </div>
    </>
  )
}


export default Document