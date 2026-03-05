document.querySelector('button').addEventListener('click', getShow)

function getShow() {

    let show = document.querySelector('input').value
    let url = `https://api.tvmaze.com/search/shows?q=${show}`

    fetch (url) 
    .then(res => res.json())
    .then (data => {
        document.querySelector('img').src = data[0].show.image.medium
        document.querySelector('.summary').innerText = replaceTags(data[0].show.summary)
        
        let id = data[0].show.id
        let episodesRef = `https://api.tvmaze.com/shows/${id}/episodes`

        fetch(episodesRef)
            .then(epRes => epRes.json())
            .then(epData => {
                for (let episode in epData) {
                    console.log(epData[episode].name)
                }
            })
            .catch(err => console.log(`error ${err}`))

        console.log(data[0].show)
    })
    .catch(err => console.log(`err ${err}`))

}

// get rid of HTML tags passed in with API, but mainting styling
function replaceTags(str) {
    let newString = str.replaceAll('<p>', '\n')
    return newString.replaceAll('</p>', '\n')
}
