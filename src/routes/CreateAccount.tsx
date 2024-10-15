import AuthForm from "../AuthForm.tsx";

export default () =>  {
    return (
        <AuthForm
            title="Create Account"
            apiEndpoint="/user/signup"
            buttonText="Create Account"
            navigation="/login"
        />
    );
};
