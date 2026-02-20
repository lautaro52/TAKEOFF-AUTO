export const signInWithGoogleMock = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                user: {
                    email: 'usuario_google@gmail.com',
                    displayName: 'Usuario Google Test'
                }
            });
        }, 1500);
    });
};
