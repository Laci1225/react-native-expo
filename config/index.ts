import Config, {NativeConfig} from "react-native-config"

interface Environment extends NativeConfig{
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
}
export default Config as Environment;