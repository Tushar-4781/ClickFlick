export function getDate(releaseDate){
    const release = new Date(releaseDate);
    const today = new Date();
    var diffYear = today.getFullYear()-release.getFullYear();
    var diffMonth = today.getMonth()-release.getMonth();
    var diffDay = today.getDay()-release.getDay();
    var diffMin = today.getMinutes()-release.getMinutes();
    var diffSec = today.getSeconds()-release.getSeconds();
    if(diffYear!==0)
        return `${diffYear} year${diffYear<=1 ? '':'s'} ago`;
    if(diffMonth!==0)
        return `${diffMonth} month${diffMonth<=1 ? '':'s'} ago`;
    
    if(diffDay!==0)
        return `${diffDay} day${diffDay<=1 ? '':'s'} ago`;
    if(diffMin!==0)
        return `${diffMin} minute${diffMin<=1 ? '':'s'} ago`;
    
    return `${diffSec} second${diffSec<=1 ? '':'s'} ago`;
    
    }
