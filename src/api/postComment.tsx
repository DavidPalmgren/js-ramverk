import GraphQLqueries from "../GraphQLqueries"

const addComment = async (docId:string, comment:string, line:string) => {
  try {
    const apiAddress = import.meta.env.VITE_API_ADDRESS
    const token = localStorage.getItem('Bearer')
    const query = await GraphQLqueries.insertComment(docId, comment, line)
    console.log(typeof(docId))
    console.log(typeof(comment))
    console.log(typeof(line))
    const response = await fetch(`${apiAddress}/query`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${token}`
      },
      body: JSON.stringify({ query }),
      method: "POST"
    })
    if (!response.ok) {
      const errorMsg = await response.text();
      console.error('Somethign went wrong when adding comment', errorMsg)
    } else if (response.ok) {
      console.log('Comment added successfully!')
      const result = await response.json()
      return result
    }
  } catch (e) {
    console.error(e)
  }
}

export default { addComment }