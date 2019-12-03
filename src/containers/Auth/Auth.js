import React from 'react'

type Props = {
    test?: boolean,
}

const Auth = (props: Props) => (
    <div>
        <a href="http://localhost:5000/api/auth/google/start">GOOGLE</a>
        <a href="http://localhost:5000/api/auth/facebook/start">FACEBOOK</a>
        <a href="http://localhost:5000/api/auth/twitter/start">TWITTER</a>
    </div>
)

export default Auth
