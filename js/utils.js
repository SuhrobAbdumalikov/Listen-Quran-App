//============>> for all api urls <<==========//
export async function customFetch(url) {
    try {
        const response =await fetch(url)
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error in fetch', error);
    }
}