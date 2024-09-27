
import { View, Text, Button, Colors } from 'react-native-ui-lib'
import { Alert } from "react-native"
import { useEffect } from "react"

import tw from "@/tailwind"
import Welcome from "@/assets/welcome.svg"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from "expo-router"


import { auth } from "@/firebaseConfig"


const Index = () => {
	const router = useRouter()

	// useEffect(()=>{
	// 	if (auth.currentUser) return router.replace("(tabs)")
	// }, [])

	return (
		 <SafeAreaView style={tw`flex-1 bg-white px-6 py-10 justify-between`} >
            <View style={tw`gap-y-8`} >
                <Welcome width={356} />
                <View>
                    <Text h2 poppinsMedium center onPress = {()=> router.push("auth/await_email_verification")} >Welcome</Text>
                    <Text poppinsLight center>Have a better driving experience</Text>
                </View>
            </View>
            <View style={tw`gap-y-3`} >
      
       		<Link href = "auth/sign_up" asChild>
	          <Button
                label ="Create An Account"  
                // style = {tw`p-4 bg-[#1e3a8a]`}
                style={tw`btn`}
                // disabled = {true}
                poppins
                // rounded
	            />
       		</Link>  
            <Link asChild href="/auth/sign_in">
                <Button
                label ="Log In"  
                backgroundColor = "1e3a8a"
                style={tw`outline`}
                labelStyle = {tw`text-blue-800`}
                poppins
                rounded
                outline
                /> 
            </Link>    	
      
            </View>
        </SafeAreaView>
	)
}

export default Index
