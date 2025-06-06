import { Link } from "react-router-dom";
import "../src/error.css";

export default function ErrorPage(){
    return(
        <main className="errorPage">
            <h2>Oops, this page doesn't exist</h2>
            <p>Go back to the <Link to="/">home</Link></p>
        </main>
    );
}