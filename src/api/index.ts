
async function get() {
    const result = await fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => response.json())
    return result
}






export const api = {
    get
}