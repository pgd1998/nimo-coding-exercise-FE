// import fetch from "node-fetch";

const coinGeckoApi = async()=>{
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud`
    const options = {
        method:"GET",
        headers:{
            accept: 'application/json', 
            'x-cg-demo-api-key':'CG-zCFAZq6SwEys9uRyMVSCJjDj'
        }
    }

    try {
        const res = await fetch (url,options);
        if (!res.ok){
            return;
        }
        const result=await res.json()
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }

}
export default coinGeckoApi;