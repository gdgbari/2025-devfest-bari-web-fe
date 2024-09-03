


export const redirectUrl = (url: string) => {
    const encodedUrl = btoa(url).replace(/\+/g, '-').replace(/\//g, '_');
    return "/redirect/" + encodedUrl;
}