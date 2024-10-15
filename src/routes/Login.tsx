import AuthForm from '../AuthForm.tsx';


export default () => {
    return (
        <AuthForm
            title="Login"
            apiEndpoint="/user/signin"
            buttonText="Login"
            navigation="/"
        />
    );
};