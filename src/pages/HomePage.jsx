import { useState } from "react";
import CryptoTable from "../components/CryptoTable/CryptoTable";
import SearchBar from "../components/SearchBar/SearchBar";

const Home = ()=>{
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <SearchBar setSearchTerm={setSearchTerm}/>
            <CryptoTable searchTerm={searchTerm}/>
        </div>
    )
}

export default Home;