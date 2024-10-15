
import { View, Text, Button, Colors } from 'react-native-ui-lib'
import { Alert } from "react-native"
import { useEffect } from "react"

import tw from "@/tailwind"
import Welcome from "@/assets/welcome.svg"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from "expo-router"


import { auth, db } from "@/firebaseConfig"
import { addDoc, collection } from "firebase/firestore";



const Index = () => {
	const router = useRouter()

    
	// useEffect(()=>{
	// 	if (auth.currentUser) return router.replace("(tabs)")
	// }, [auth.currentUser])
    const setupTrades = async () => {
        console.log("Setting up trades:")
        const res = await addDoc(collection(db, "Trades"), {
        USDT_amount: 500,
        rate: 10.5,
        transaction_time_limit: "2024-09-20T10:00:00Z",
        trade_status: "open",
        transaction: "", // Reference to a Transaction (to be linked later)
        user: "", // Reference to a user (to be linked later)
      });

        console.log("Done", res)
    }

	return (
		 <SafeAreaView style={tw`flex-1 bg-white px-6 py-10 justify-between`} >
            <View style={tw`gap-y-8`} >
                <Welcome width={356} />
                <View>
                    <Text h2 poppinsMedium center onPress = {()=> router.push("(tabs)")} >Welcome</Text>
                    <Text poppinsLight center onPress={setupTrades} >Have a better driving experience</Text>
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
                label ="Sign In"  
                backgroundColor = "1e3a8a"
                style={tw`outline rounded-md`}
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
