import { useContext } from "react";
import { useRouteError } from "react-router-dom";
import { JwtContext, SessionContext } from "./App";

export default function ErrorBoundary2(){
    let error = useRouteError();
    const {setJwt} = useContext(JwtContext);
    const {setToken} = useContext(SessionContext);
    

    if (error.status === 428) setToken("");
    if(error.status === 401) setJwt("");


    throw error;

}