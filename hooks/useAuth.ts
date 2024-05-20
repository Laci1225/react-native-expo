import {useContext, useState} from "react";
import {AuthContext, LoginMethods} from "@/context/AuthContext";
import auth0, {AUDIENCE, CONNECTION} from "@/modules/auth0";


const useAuth =() => {
    const {token, isLoggedIn, saveToken, logout} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    const webLogin = async () =>{
        try {
            const credentials = await auth0.webAuth.authorize({
                audience: AUDIENCE,
                connection: CONNECTION,
            });
            const {accessToken} = credentials;
            saveToken(accessToken, LoginMethods.web);
            } catch (error) {
                console.log(error);
            }
        }
    const nativeLogin = async (email: string, password:string) => {
        setIsLoading(true);
        try {
            const user = await auth0.auth.createUser({
                connection: CONNECTION,
                email,
                password,
            });
            if (!user.id)
                throw new Error("User not created");
        const credentials = await auth0.auth.passwordRealm({
            username: email,
            password,
            realm: CONNECTION,
            audience: AUDIENCE,
        });
        const {accessToken} = credentials;
        saveToken(accessToken, LoginMethods.native);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }
    return {token, isLoggedIn, nativeLogin,webLogin, logout, isLoading};
}
export default useAuth;
