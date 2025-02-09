import { fetchAuthSession } from "aws-amplify/auth"
import { ToastNotification } from "@/Utils/CustomFunctions/ToastNotification"

// Function to get policy data
export const PolicyGet = async (values) => {
    console.log('Form values:', values);
    const token = await fetchAuthSession();
    try {
        const response = await fetch(`${process.env.API_URL}/get-setting`, {
        // const response = await fetch('http://localhost:4000/get-setting', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        return data.Item;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// Function to post policy data
export const PolicyPost = async (values) => {
    console.log('Form values:', values);
    const token = await fetchAuthSession();
    try {
        const response = await fetch(`${process.env.API_URL}/setting`, {
        // const response = await fetch('http://localhost:4000/setting', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token?.tokens?.idToken?.toString()}`
            },
            body: JSON.stringify(values)
        });
        ToastNotification("success", "Thêm chính sách thành công");
        console.log('response', response);
    } catch (error) {
        console.error('Error:', error);
    }
};
